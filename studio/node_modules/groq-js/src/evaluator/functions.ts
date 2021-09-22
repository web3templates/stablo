import {SyntaxNode} from '../nodeTypes'
import {totalCompare} from './ordering'
import {Scope, Executor} from './index'
import {
  StaticValue,
  Path,
  getType,
  fromNumber,
  TRUE_VALUE,
  FALSE_VALUE,
  NULL_VALUE,
  Value
} from './value'

function hasReference(value: any, id: string): boolean {
  switch (getType(value)) {
    case 'array':
      for (let v of value) {
        if (hasReference(v, id)) return true
      }
      break
    case 'object':
      if (value._ref === id) return true
      for (let v of Object.values(value)) {
        if (hasReference(v, id)) return true
      }
      break
  }
  return false
}

function countUTF8(str: string): number {
  let count = 0
  for (let i = 0; i < str.length; i++) {
    let code = str.charCodeAt(i)
    if (code >= 0xd800 && code <= 0xdbff) {
      // High surrogate. Don't count this.
      // By only counting the low surrogate we will correctly
      // count the number of UTF-8 code points.
      continue
    }
    count++
  }
  return count
}

type GroqFunctionArg = any
type WithArity<T> = T & {
  arity?: GroqFunctionArity
}

export type GroqFunctionArity = number | ((count: number) => boolean)

export type GroqFunction = (
  args: GroqFunctionArg[],
  scope: Scope,
  execute: Executor
) => PromiseLike<Value>

export const functions: {[key: string]: WithArity<GroqFunction>} = {}

functions.coalesce = async function coalesce(args, scope, execute) {
  for (let arg of args) {
    let value = await execute(arg, scope)
    if (value.getType() !== 'null') return value
  }
  return NULL_VALUE
}

functions.count = async function count(args, scope, execute) {
  let inner = await execute(args[0], scope)
  if (inner.getType() !== 'array') return NULL_VALUE

  let num = 0
  for await (let _ of inner) {
    num++
  }
  return new StaticValue(num)
}
functions.count.arity = 1

functions.defined = async function defined(args, scope, execute) {
  let inner = await execute(args[0], scope)
  return inner.getType() === 'null' ? FALSE_VALUE : TRUE_VALUE
}
functions.defined.arity = 1

functions.identity = async function identity(args) {
  return new StaticValue('me')
}
functions.identity.arity = 0

functions.length = async function length(args, scope, execute) {
  let inner = await execute(args[0], scope)

  if (inner.getType() === 'string') {
    let data = await inner.get()
    return fromNumber(countUTF8(data))
  }

  return NULL_VALUE
}
functions.length.arity = 1

functions.path = async function path(args, scope, execute) {
  let inner = await execute(args[0], scope)
  if (inner.getType() !== 'string') return NULL_VALUE

  let str = await inner.get()

  return new StaticValue(new Path(str))
}
functions.path.arity = 1

functions.select = async function select(args, scope, execute) {
  // First check if everything is valid:
  let seenFallback = false
  for (let arg of args) {
    if (seenFallback) return NULL_VALUE

    if (arg.type === 'Pair') {
      // This is fine.
    } else {
      seenFallback = true
    }
  }

  for (let arg of args) {
    if (arg.type === 'Pair') {
      let cond = await execute(arg.left, scope)
      if (cond.getBoolean()) {
        return await execute(arg.right, scope)
      }
    } else {
      return await execute(arg, scope)
    }
  }

  return NULL_VALUE
}

functions.references = async function references(args, scope, execute) {
  let idValue = await execute(args[0], scope)
  if (idValue.getType() !== 'string') return FALSE_VALUE

  let id = await idValue.get()
  let scopeValue = scope.value
  return hasReference(scopeValue, id) ? TRUE_VALUE : FALSE_VALUE
}
functions.references.arity = 1

functions.round = async function round(args, scope, execute) {
  let value = await execute(args[0], scope)
  if (value.getType() !== 'number') return NULL_VALUE

  let num = await value.get()
  let prec = 0

  if (args.length === 2) {
    let precValue = await execute(args[1], scope)
    if (precValue.getType() !== 'number') return NULL_VALUE
    prec = await precValue.get()
  }

  if (prec === 0) {
    return fromNumber(Math.round(num))
  } else {
    return fromNumber(Number(num.toFixed(prec)))
  }
}
functions.round.arity = count => count >= 1 && count <= 2

functions.now = async function now(args, scope) {
  return new StaticValue(scope.timestamp)
}
functions.now.arity = 0

export type GroqPipeFunction = (
  base: Value,
  args: SyntaxNode[],
  scope: Scope,
  execute: Executor
) => PromiseLike<Value>

export const pipeFunctions: {[key: string]: WithArity<GroqPipeFunction>} = {}

pipeFunctions.order = async function order(base, args, scope, execute) {
  // This is a workaround for https://github.com/rpetrich/babel-plugin-transform-async-to-promises/issues/59
  await true

  if (base.getType() !== 'array') return NULL_VALUE

  let mappers = []
  let directions: string[] = []
  let n = 0

  for (let mapper of args) {
    let direction = 'asc'

    if (mapper.type === 'Desc') {
      direction = 'desc'
      mapper = mapper.base
    } else if (mapper.type === 'Asc') {
      mapper = mapper.base
    }

    mappers.push(mapper)
    directions.push(direction)
    n++
  }

  let aux = []

  for await (let value of base) {
    let newScope = scope.createNested(value)
    let tuple = [await value.get()]
    for (let i = 0; i < n; i++) {
      let result = await execute(mappers[i], newScope)
      tuple.push(await result.get())
    }
    aux.push(tuple)
  }

  aux.sort((aTuple, bTuple) => {
    for (let i = 0; i < n; i++) {
      let c = totalCompare(aTuple[i + 1], bTuple[i + 1])
      if (directions[i] === 'desc') c = -c
      if (c !== 0) return c
    }
    return 0
  })

  return new StaticValue(aux.map(v => v[0]))
}
pipeFunctions.order.arity = count => count >= 1
