import {Value} from './value'

export type Token = string

export type Pattern = (tokens: Token[]) => boolean

export function matchText(tokens: Token[], patterns: Pattern[]): boolean {
  if (tokens.length === 0 || patterns.length === 0) return false

  return patterns.every(pattern => pattern(tokens))
}

export function matchTokenize(text: string): Token[] {
  return text.match(/[A-Za-z0-9]+/g)
}

export function matchAnalyzePattern(text: string): Pattern {
  let terms = text.match(/[A-Za-z0-9*]+/g) || []
  let termsRe = terms.map(term => new RegExp('^' + term.replace(/\*/g, '.*') + '$', 'i'))
  return (tokens: Token[]) => termsRe.every(re => tokens.some(token => re.test(token)))
}

export async function gatherText(value: Value, cb: (str: string) => void) {
  switch (value.getType()) {
    case 'string': {
      cb(await value.get())
      return true
    }

    case 'array': {
      let success = true
      for await (let part of value) {
        if (part.getType() === 'string') {
          cb(await part.get())
        } else {
          success = false
        }
      }
      return success
    }

    default: {
      return false
    }
  }
}
