import {NodeBuilder} from './parser'

export type MarkName =
  | 'add'
  | 'and'
  | 'arr_expr'
  | 'array_end'
  | 'array_splat'
  | 'array'
  | 'asc'
  | 'attr_ident'
  | 'comp'
  | 'dblparent'
  | 'deref_field'
  | 'deref'
  | 'desc'
  | 'div'
  | 'exc_range'
  | 'filter'
  | 'float'
  | 'func_args_end'
  | 'func_call'
  | 'ident'
  | 'inc_range'
  | 'integer'
  | 'mod'
  | 'mul'
  | 'neg'
  | 'not'
  | 'object_end'
  | 'object_expr'
  | 'object_pair'
  | 'object_splat_this'
  | 'object_splat'
  | 'object'
  | 'or'
  | 'pair'
  | 'param'
  | 'paren'
  | 'parent'
  | 'pipecall'
  | 'pos'
  | 'pow'
  | 'project'
  | 'sci'
  | 'star'
  | 'str_begin'
  | 'sub'
  | 'this'

export interface Mark {
  name: MarkName
  position: number
}

export type MarkVisitor = {[key in MarkName]?: NodeBuilder}

export class MarkProcessor {
  private visitor: MarkVisitor
  private string: string
  private marks: Mark[]
  private index: number

  constructor(visitor: MarkVisitor, string: string, marks: Mark[]) {
    this.visitor = visitor
    this.string = string
    this.marks = marks
    this.index = 0
  }

  hasMark(pos = 0) {
    return this.index + pos < this.marks.length
  }

  getMark(pos = 0) {
    return this.marks[this.index + pos]
  }

  shift() {
    this.index += 1
  }

  process() {
    let mark = this.marks[this.index]
    this.shift()
    let func = this.visitor[mark.name]
    if (!func) throw new Error('Unknown handler: ' + mark.name)
    return func.call(this.visitor, this, mark)
  }

  processString() {
    this.shift()
    return this.processStringEnd()
  }

  processStringEnd() {
    let prev = this.marks[this.index - 1]
    let curr = this.marks[this.index]
    this.shift()
    return this.string.slice(prev.position, curr.position)
  }
}
