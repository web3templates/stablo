/**
 * @internal
 */
export type MethodReturnType<T> = T extends (...args: unknown[]) => infer R ? R : any // eslint-disable-line @typescript-eslint/no-explicit-any

/**
 * @internal
 */
export type ArgumentTypes<F extends Function> = F extends (...args: infer A) => unknown ? A : never

/**
 * Error type thrown when the library fails to resolve a value, such as an asset ID,
 * filename or project ID/dataset information.
 *
 * The `input` property holds the value passed as the input, which failed to be
 * resolved to something meaningful.
 */
export class UnresolvableError extends Error {
  unresolvable = true

  // The input may not be a valid source, so let's not type it as one
  input?: unknown

  constructor(inputSource: unknown, message = 'Failed to resolve asset ID from source') {
    super(message)
    this.input = inputSource
  }
}

/**
 * Checks whether or not an error instance is of type UnresolvableError
 *
 * @param err - Error to check for unresolvable error type
 * @returns True if the passed error instance appears to be an unresolveable error
 */
export function isUnresolvableError(err: Error): err is UnresolvableError {
  const error = err as UnresolvableError
  return Boolean(error.unresolvable && 'input' in error)
}

/**
 * Returns a getter which returns `undefined` instead of throwing,
 * if encountering an `UnresolvableError`
 *
 * @param method - Function to use as resolver
 * @returns Function that returns `undefined` if passed resolver throws UnresolvableError
 * @internal
 */
export function getForgivingResolver<T extends Function>(method: T) {
  return function (...args: ArgumentTypes<T>): MethodReturnType<T> | undefined {
    try {
      return method(...args)
    } catch (err) {
      if (isUnresolvableError(err)) {
        return undefined
      }

      throw err
    }
  }
}
