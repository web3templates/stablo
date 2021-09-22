// @flow
export type Path = Array<string | number>

// declare function reduce<T, MemoT>(o: {[key:string]: T}, iterator: (m: MemoT, val: T, key: string)=>MemoT, initialMemo?: MemoT): MemoT;

export type Reducer<Value, Accumulator> = (
  accumulator: Accumulator,
  value: Value,
  path: Path
) => Accumulator
