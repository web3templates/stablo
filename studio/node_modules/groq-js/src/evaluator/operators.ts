import {SyntaxNode} from '../nodeTypes'
import {StaticValue, TRUE_VALUE, FALSE_VALUE, NULL_VALUE, fromNumber, Value} from './value'
import {isEqual} from './equality'
import {partialCompare} from './ordering'
import {Scope, Executor} from './'
import {gatherText, Token, Pattern, matchText, matchTokenize, matchAnalyzePattern} from './matching'

type GroqOperator =
  | '=='
  | '!='
  | '>'
  | '>='
  | '<'
  | '<='
  | '+'
  | '-'
  | '*'
  | '/'
  | '%'
  | '**'
  | 'in'
  | 'match'

type GroqOperatorFn = (
  left: SyntaxNode,
  right: SyntaxNode,
  scope: Scope,
  execute: Executor
) => Value | PromiseLike<Value>

export const operators: {[key in GroqOperator]: GroqOperatorFn} = {
  '==': async function eq(left, right, scope, execute) {
    let a = await execute(left, scope)
    let b = await execute(right, scope)
    let result = await isEqual(a, b)
    return result ? TRUE_VALUE : FALSE_VALUE
  },

  '!=': async function neq(left, right, scope, execute) {
    let a = await execute(left, scope)
    let b = await execute(right, scope)
    let result = await isEqual(a, b)
    return result ? FALSE_VALUE : TRUE_VALUE
  },

  '>': async function gt(left, right, scope, execute) {
    let a = await (await execute(left, scope)).get()
    let b = await (await execute(right, scope)).get()
    let result = partialCompare(a, b)

    if (result === null) {
      return NULL_VALUE
    } else {
      return result > 0 ? TRUE_VALUE : FALSE_VALUE
    }
  },

  '>=': async function gte(left, right, scope, execute) {
    let a = await (await execute(left, scope)).get()
    let b = await (await execute(right, scope)).get()
    let result = partialCompare(a, b)

    if (result === null) {
      return NULL_VALUE
    } else {
      return result >= 0 ? TRUE_VALUE : FALSE_VALUE
    }
  },

  '<': async function lt(left, right, scope, execute) {
    let a = await (await execute(left, scope)).get()
    let b = await (await execute(right, scope)).get()
    let result = partialCompare(a, b)

    if (result === null) {
      return NULL_VALUE
    } else {
      return result < 0 ? TRUE_VALUE : FALSE_VALUE
    }
  },

  '<=': async function lte(left, right, scope, execute) {
    let a = await (await execute(left, scope)).get()
    let b = await (await execute(right, scope)).get()
    let result = partialCompare(a, b)

    if (result === null) {
      return NULL_VALUE
    } else {
      return result <= 0 ? TRUE_VALUE : FALSE_VALUE
    }
  },

  in: async function inop(left, right, scope, execute) {
    let a = await execute(left, scope)
    let choices = await execute(right, scope)

    switch (choices.getType()) {
      case 'array':
        for await (let b of choices) {
          if (await isEqual(a, b)) {
            return TRUE_VALUE
          }
        }
        return FALSE_VALUE
      case 'range':
        let value = await a.get()
        let range = await choices.get()
        let leftCmp = partialCompare(value, range.left)
        if (leftCmp === null) return NULL_VALUE
        let rightCmp = partialCompare(value, range.right)
        if (rightCmp === null) return NULL_VALUE

        if (range.isExclusive()) {
          return leftCmp >= 0 && rightCmp < 0 ? TRUE_VALUE : FALSE_VALUE
        } else {
          return leftCmp >= 0 && rightCmp <= 0 ? TRUE_VALUE : FALSE_VALUE
        }
      case 'path':
        if (a.getType() !== 'string') return NULL_VALUE
        let str = await a.get()
        let path = await choices.get()
        return path.matches(str) ? TRUE_VALUE : FALSE_VALUE
    }

    return NULL_VALUE
  },

  match: async function match(left, right, scope, execute) {
    let text = await execute(left, scope)
    let pattern = await execute(right, scope)

    let tokens: Token[] = []
    let patterns: Pattern[] = []

    await gatherText(text, part => {
      tokens = tokens.concat(matchTokenize(part))
    })

    let didSucceed = await gatherText(pattern, part => {
      patterns = patterns.concat(matchAnalyzePattern(part))
    })
    if (!didSucceed) return FALSE_VALUE

    let matched = matchText(tokens, patterns)

    return matched ? TRUE_VALUE : FALSE_VALUE
  },

  '+': async function plus(left, right, scope, execute) {
    let a = await execute(left, scope)
    let b = await execute(right, scope)
    let aType = a.getType()
    let bType = b.getType()

    if ((aType === 'number' && bType === 'number') || (aType === 'string' && bType === 'string')) {
      return new StaticValue((await a.get()) + (await b.get()))
    }

    if (aType === 'array' && bType === 'array') {
      return new StaticValue((await a.get()).concat(await b.get()))
    }

    if (aType === 'object' && bType === 'object') {
      return new StaticValue({...(await a.get()), ...(await b.get())})
    }

    return NULL_VALUE
  },

  '-': numericOperator((a, b) => a - b),
  '*': numericOperator((a, b) => a * b),
  '/': numericOperator((a, b) => a / b),
  '%': numericOperator((a, b) => a % b),
  '**': numericOperator((a, b) => Math.pow(a, b))
}

function numericOperator(impl: (a: number, b: number) => number): GroqOperatorFn {
  return async function(left, right, scope, execute) {
    let a = await execute(left, scope)
    let b = await execute(right, scope)
    let aType = a.getType()
    let bType = b.getType()

    if (aType === 'number' && bType === 'number') {
      let result = impl(await a.get(), await b.get())
      return fromNumber(result)
    }

    return NULL_VALUE
  }
}
