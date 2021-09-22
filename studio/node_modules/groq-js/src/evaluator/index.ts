import * as NodeTypes from '../nodeTypes'
import {
  StaticValue,
  StreamValue,
  MapperValue,
  NULL_VALUE,
  TRUE_VALUE,
  FALSE_VALUE,
  Range,
  Pair,
  fromNumber,
  fromJS,
  Value
} from './value'
import {functions, pipeFunctions} from './functions'
import {operators} from './operators'

function inMapper(value: Value, fn: (value: Value) => Value | PromiseLike<Value>) {
  if (value instanceof MapperValue) {
    return new MapperValue(
      new StreamValue(async function*() {
        for await (let elementValue of value) {
          yield await fn(elementValue)
        }
      })
    )
  } else {
    return fn(value)
  }
}

export class Scope {
  public params: {[key: string]: any}
  public source: any
  public value: Value
  public parent: Scope | null
  public timestamp: string

  constructor(params: {[key: string]: any}, source: any, value: Value, parent: Scope | null) {
    this.params = params
    this.source = source
    this.value = value
    this.parent = parent
    this.timestamp = parent ? parent.timestamp : new Date().toISOString()
  }

  createNested(value: Value) {
    return new Scope(this.params, this.source, value, this)
  }
}

function execute(node: NodeTypes.SyntaxNode, scope: Scope) {
  if (typeof EXECUTORS[node.type] === 'undefined') {
    throw new Error('No executor for node.type=' + node.type)
  }

  const func = EXECUTORS[node.type]
  return func(node, scope)
}

export type Executor = (node: NodeTypes.SyntaxNode, scope: Scope) => Value | PromiseLike<Value>

export type ExecutorMap = {
  This: (node: NodeTypes.ThisNode, scope: Scope) => Value | PromiseLike<Value>
  Star: (node: NodeTypes.StarNode, scope: Scope) => Value | PromiseLike<Value>
  Parameter: (node: NodeTypes.ParameterNode, scope: Scope) => Value | PromiseLike<Value>
  Parent: (node: NodeTypes.ParentNode, scope: Scope) => Value | PromiseLike<Value>
  OpCall: (node: NodeTypes.OpCallNode, scope: Scope) => Value | PromiseLike<Value>
  FuncCall: (node: NodeTypes.FuncCallNode, scope: Scope) => Value | PromiseLike<Value>
  PipeFuncCall: (node: NodeTypes.PipeFuncCallNode, scope: Scope) => Value | PromiseLike<Value>
  Filter: (node: NodeTypes.FilterNode, scope: Scope) => Value | PromiseLike<Value>
  Element: (node: NodeTypes.ElementNode, scope: Scope) => Value | PromiseLike<Value>
  Slice: (node: NodeTypes.SliceNode, scope: Scope) => Value | PromiseLike<Value>
  Attribute: (node: NodeTypes.AttributeNode, scope: Scope) => Value | PromiseLike<Value>
  Identifier: (node: NodeTypes.IdentifierNode, scope: Scope) => Value | PromiseLike<Value>
  Value: (node: NodeTypes.ValueNode, scope: Scope) => Value | PromiseLike<Value>
  Mapper: (node: NodeTypes.MapperNode, scope: Scope) => Value | PromiseLike<Value>
  Parenthesis: (node: NodeTypes.ParenthesisNode, scope: Scope) => Value | PromiseLike<Value>
  Projection: (node: NodeTypes.ProjectionNode, scope: Scope) => Value | PromiseLike<Value>
  Deref: (node: NodeTypes.DerefNode, scope: Scope) => Value | PromiseLike<Value>
  Object: (node: NodeTypes.ObjectNode, scope: Scope) => Value | PromiseLike<Value>
  Array: (node: NodeTypes.ArrayNode, scope: Scope) => Value | PromiseLike<Value>
  Range: (node: NodeTypes.RangeNode, scope: Scope) => Value | PromiseLike<Value>
  Pair: (node: NodeTypes.PairNode, scope: Scope) => Value | PromiseLike<Value>
  Or: (node: NodeTypes.OrNode, scope: Scope) => Value | PromiseLike<Value>
  And: (node: NodeTypes.AndNode, scope: Scope) => Value | PromiseLike<Value>
  Not: (node: NodeTypes.NotNode, scope: Scope) => Value | PromiseLike<Value>
  Neg: (node: NodeTypes.NegNode, scope: Scope) => Value | PromiseLike<Value>
  Pos: (node: NodeTypes.PosNode, scope: Scope) => Value | PromiseLike<Value>
  Asc: (node: NodeTypes.AscNode, scope: Scope) => Value | PromiseLike<Value>
  Desc: (node: NodeTypes.DescNode, scope: Scope) => Value | PromiseLike<Value>
  [key: string]: any
}

const EXECUTORS: ExecutorMap = {
  This(_: NodeTypes.ThisNode, scope: Scope) {
    return scope.value
  },

  Star(_: NodeTypes.StarNode, scope: Scope) {
    return scope.source
  },

  Parameter({name}: NodeTypes.ParameterNode, scope: Scope) {
    return fromJS(scope.params[name])
  },

  Parent(node: NodeTypes.ParentNode, scope: Scope) {
    let current = scope
    for (let i = 0; i < node.n; i++) {
      if (!current.parent) {
        return NULL_VALUE
      }

      current = current.parent
    }
    return current.value
  },

  OpCall({op, left, right}: NodeTypes.OpCallNode, scope: Scope) {
    let func = operators[op]
    if (!func) throw new Error('Unknown operator: ' + op)
    return func(left, right, scope, execute)
  },

  FuncCall({func, args}: NodeTypes.FuncCallNode, scope: Scope) {
    return func(args, scope, execute)
  },

  async PipeFuncCall({func, base, args}: NodeTypes.PipeFuncCallNode, scope: Scope) {
    let baseValue = await execute(base, scope)
    return func(baseValue, args, scope, execute)
  },

  async Filter({base, query}: NodeTypes.FilterNode, scope: Scope) {
    let baseValue = await execute(base, scope)

    return inMapper(baseValue, async value => {
      if (value.getType() !== 'array') return NULL_VALUE

      return new StreamValue(async function*() {
        for await (let element of value) {
          let newScope = scope.createNested(element)
          let condValue = await execute(query, newScope)
          if (condValue.getBoolean()) yield element
        }
      })
    })
  },

  async Element({base, index}: NodeTypes.ElementNode, scope: Scope) {
    let baseValue = await execute(base, scope)

    return inMapper(baseValue, async arrayValue => {
      if (arrayValue.getType() !== 'array') return NULL_VALUE

      let idxValue = await execute(index, scope)
      if (idxValue.getType() !== 'number') return NULL_VALUE

      // OPT: Here we can optimize when idx >= 0
      let array = await arrayValue.get()
      let idx = await idxValue.get()

      if (idx < 0) {
        idx = array.length + idx
      }

      if (idx >= 0 && idx < array.length) {
        return new StaticValue(array[idx])
      } else {
        // Make sure we return `null` for out-of-bounds access
        return NULL_VALUE
      }
    })
  },

  async Slice({base, left, right, isExclusive}: NodeTypes.SliceNode, scope: Scope) {
    let baseValue = await execute(base, scope)

    return inMapper(baseValue, async arrayValue => {
      if (arrayValue.getType() !== 'array') return NULL_VALUE

      let leftIdxValue = await execute(left, scope)
      let rightIdxValue = await execute(right, scope)

      if (leftIdxValue.getType() !== 'number' || rightIdxValue.getType() !== 'number') {
        return NULL_VALUE
      }

      // OPT: Here we can optimize when either indices are >= 0
      let array = (await arrayValue.get()) as any[]
      let leftIdx = (await leftIdxValue.get()) as number
      let rightIdx = (await rightIdxValue.get()) as number

      // Handle negative index
      if (leftIdx < 0) leftIdx = array.length + leftIdx
      if (rightIdx < 0) rightIdx = array.length + rightIdx

      // Convert from inclusive to exclusive index
      if (!isExclusive) rightIdx++

      if (leftIdx < 0) leftIdx = 0
      if (rightIdx < 0) rightIdx = 0

      // Note: At this point the indices might point out-of-bound, but
      // .slice handles this correctly.

      return new StaticValue(array.slice(leftIdx, rightIdx))
    })
  },

  async Attribute({base, name}: NodeTypes.AttributeNode, scope: Scope) {
    let baseValue = await execute(base, scope)

    return inMapper(baseValue, async value => {
      if (value.getType() === 'object') {
        let data = await value.get()
        if (data.hasOwnProperty(name)) {
          return new StaticValue(data[name])
        }
      }

      return NULL_VALUE
    })
  },

  async Identifier({name}: NodeTypes.IdentifierNode, scope: Scope) {
    if (scope.value.getType() === 'object') {
      let data = await scope.value.get()
      if (data.hasOwnProperty(name)) {
        return new StaticValue(data[name])
      }
    }

    return NULL_VALUE
  },

  Value({value}: NodeTypes.ValueNode) {
    return new StaticValue(value)
  },

  async Mapper({base}: NodeTypes.MapperNode, scope: Scope) {
    let baseValue = await execute(base, scope)
    if (baseValue.getType() !== 'array') return baseValue

    if (baseValue instanceof MapperValue) {
      return new MapperValue(
        new StreamValue(async function*() {
          for await (let element of baseValue) {
            if (element.getType() === 'array') {
              for await (let subelement of element) {
                yield subelement
              }
            } else {
              yield NULL_VALUE
            }
          }
        })
      )
    } else {
      return new MapperValue(baseValue)
    }
  },

  async Parenthesis({base}: NodeTypes.ParenthesisNode, scope: Scope) {
    let baseValue = await execute(base, scope)
    if (baseValue instanceof MapperValue) {
      baseValue = baseValue.value
    }
    return baseValue
  },

  async Projection({base, query}: NodeTypes.ProjectionNode, scope: Scope) {
    let baseValue = await execute(base, scope)
    if (baseValue.getType() === 'null') return NULL_VALUE

    if (baseValue.getType() === 'array') {
      return new StreamValue(async function*() {
        for await (let value of baseValue) {
          let newScope = scope.createNested(value)
          let newValue = await execute(query, newScope)
          yield newValue
        }
      })
    }

    let newScope = scope.createNested(baseValue)
    return await execute(query, newScope)
  },

  async Deref({base}: NodeTypes.DerefNode, scope: Scope) {
    let baseValue = await execute(base, scope)
    return inMapper(baseValue, async baseValue => {
      if (scope.source.getType() !== 'array') return NULL_VALUE
      if (baseValue.getType() !== 'object') return NULL_VALUE

      let id = (await baseValue.get())._ref
      if (typeof id !== 'string') return NULL_VALUE

      for await (let doc of scope.source) {
        if (id === doc.data._id) {
          return doc
        }
      }

      return NULL_VALUE
    })
  },

  async Object({attributes}: NodeTypes.ObjectNode, scope: Scope) {
    let result: {[key: string]: any} = {}
    for (let attr of attributes) {
      const attrType = attr.type
      switch (attr.type) {
        case 'ObjectAttribute': {
          let key = await execute(attr.key, scope)
          if (key.getType() !== 'string') continue

          let value = await execute(attr.value, scope)
          if (value.getType() === 'null') {
            delete result[key.data]
            break
          }

          result[key.data] = await value.get()
          break
        }

        case 'ObjectConditionalSplat': {
          let cond = await execute(attr.condition, scope)
          if (!cond.getBoolean()) continue

          let value = await execute(attr.value, scope)
          if (value.getType() !== 'object') continue
          Object.assign(result, value.data)
          break
        }

        case 'ObjectSplat': {
          let value = await execute(attr.value, scope)
          if (value.getType('object')) {
            Object.assign(result, value.data)
          }
          break
        }

        default:
          throw new Error('Unknown node type: ' + attrType)
      }
    }
    return new StaticValue(result)
  },

  Array({elements}: NodeTypes.ArrayNode, scope: Scope) {
    return new StreamValue(async function*() {
      for (let element of elements) {
        let value = await execute(element.value, scope)
        if (element.isSplat) {
          if (value.getType() === 'array') {
            for await (let v of value) {
              yield v
            }
          }
        } else {
          yield value
        }
      }
    })
  },

  async Range({left, right, isExclusive}: NodeTypes.RangeNode, scope: Scope) {
    let leftValue = await execute(left, scope)
    let rightValue = await execute(right, scope)

    if (!Range.isConstructible(leftValue.getType(), rightValue.getType())) {
      return NULL_VALUE
    }

    let range = new Range(await leftValue.get(), await rightValue.get(), isExclusive)
    return new StaticValue(range)
  },

  async Pair({left, right}: NodeTypes.PairNode, scope: Scope) {
    let leftValue = await execute(left, scope)
    let rightValue = await execute(right, scope)

    let pair = new Pair(await leftValue.get(), await rightValue.get())
    return new StaticValue(pair)
  },

  async Or({left, right}: NodeTypes.OrNode, scope: Scope) {
    let leftValue = await execute(left, scope)
    let rightValue = await execute(right, scope)

    if (leftValue.getType() === 'boolean') {
      if (leftValue.data === true) return TRUE_VALUE
    }

    if (rightValue.getType() === 'boolean') {
      if (rightValue.data === true) return TRUE_VALUE
    }

    if (leftValue.getType() !== 'boolean') return NULL_VALUE
    if (rightValue.getType() !== 'boolean') return NULL_VALUE

    return FALSE_VALUE
  },

  async And({left, right}: NodeTypes.AndNode, scope: Scope) {
    let leftValue = await execute(left, scope)
    let rightValue = await execute(right, scope)

    if (leftValue.getType() === 'boolean') {
      if (leftValue.data === false) return FALSE_VALUE
    }

    if (rightValue.getType() === 'boolean') {
      if (rightValue.data === false) return FALSE_VALUE
    }

    if (leftValue.getType() !== 'boolean') return NULL_VALUE
    if (rightValue.getType() !== 'boolean') return NULL_VALUE

    return TRUE_VALUE
  },

  async Not({base}: NodeTypes.NotNode, scope: Scope) {
    let value = await execute(base, scope)
    if (value.getType() !== 'boolean') {
      return NULL_VALUE
    }
    return value.getBoolean() ? FALSE_VALUE : TRUE_VALUE
  },

  async Neg({base}: NodeTypes.NegNode, scope: Scope) {
    let value = await execute(base, scope)
    if (value.getType() !== 'number') return NULL_VALUE
    return fromNumber(-(await value.get()))
  },

  async Pos({base}: NodeTypes.PosNode, scope: Scope) {
    let value = await execute(base, scope)
    if (value.getType() !== 'number') return NULL_VALUE
    return fromNumber(await value.get())
  },

  async Asc() {
    return NULL_VALUE
  },

  async Desc() {
    return NULL_VALUE
  }
}

interface EvaluateOptions {
  // The value that will be available as `@` in GROQ.
  root?: any

  // The value that will be available as `*` in GROQ.
  dataset?: any

  // Parameters availble in the GROQ query (using `$param` syntax).
  params?: {[key: string]: any}
}

/**
 * Evaluates a query.
 */
export async function evaluate(tree: NodeTypes.SyntaxNode, options: EvaluateOptions = {}) {
  let root = fromJS(options.root)
  let dataset = fromJS(options.dataset)
  let params: {[key: string]: any} = {...options.params}

  let scope = new Scope(params, dataset, root, null)
  return await execute(tree, scope)
}
