import {Mode} from 'codemirror'
import CodeMirror from './codemirror-lib'
import {Observable} from 'rxjs'

interface Token {
  style: string | null
  token: string
}

export interface ModeSpec {
  name: string

  [key: string]: any
}

export function runMode(
  source: string,
  modespec: ModeSpec | null,
  options?: {state?: any; tabSize: number}
): Observable<Token[]> {
  return new Observable(subscriber => {
    const mode: Mode<any> = CodeMirror.getMode(CodeMirror.defaults, modespec)
    const lines = CodeMirror.splitLines(source)
    const state = (options && options.state) || CodeMirror.startState(mode)

    for (let i = 0, e = lines.length; i < e; ++i) {
      const tokens = []
      const stream = new CodeMirror.StringStream(lines[i])
      if (!stream.string && mode.blankLine) mode.blankLine(state)
      while (!stream.eol()) {
        const style = mode.token!(stream, state)
        tokens.push({token: stream.current(), style})
        stream.start = stream.pos
      }
      if (i !== lines.length - 1) {
        tokens.push({token: '\n', style: null})
      }
      subscriber.next(tokens)
    }
    subscriber.complete()
  })
}
