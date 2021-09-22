export declare function recognize(input: string): boolean

export type Mark = {
  name: string
  position: number
}

export declare function parse(
  input: string
):
  | {
      type: 'success'
      marks: Mark[]
    }
  | {
      type: 'error'
      position: number
    }
