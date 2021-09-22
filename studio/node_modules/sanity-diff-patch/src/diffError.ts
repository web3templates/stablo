import {Path, pathToString} from './paths'

export class DiffError extends Error {
  public path: Path
  public value: any
  public serializedPath: string

  constructor(message: string, path: Path, value?: any) {
    const serializedPath = pathToString(path)
    super(`${message} (at '${serializedPath}')`)

    this.path = path
    this.serializedPath = serializedPath
    this.value = value
  }
}
