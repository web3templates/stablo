import {Observable} from 'rxjs'

export interface WebSocket {
  onclose: ((this: this, ev: CloseEvent) => any) | null
  onerror: ((this: this, ev: any) => any) | null
  onmessage: ((this: this, ev: MessageEvent) => any) | null
  onopen: ((this: this, ev: any) => any) | null
  close(code?: number, reason?: string): void
}

type ErrorCode = 'CONNECTION_ERROR' | 'CONNECTION_CLOSED'

export class WebSocketError extends Error {
  code: ErrorCode
  constructor(message: string, code: ErrorCode) {
    super(message)
    this.code = code
  }
}

export function createConnect<T extends WebSocket>(
  getWebsocketInstance: (url: string, protocols?: string | string[]) => T,
) {
  return (url: string) => {
    return new Observable<T>(subscriber => {
      const ws = getWebsocketInstance(url)

      let didUnsubscribe = false

      const onOpen = () => {
        subscriber.next(ws)
      }

      const onError = () => {
        subscriber.error(
          new WebSocketError('WebSocket connection error', 'CONNECTION_ERROR'),
        )
      }

      const onClose = (ev: CloseEvent) => {
        if (!didUnsubscribe) {
          subscriber.error(
            new WebSocketError(
              'WebSocket connection error',
              'CONNECTION_CLOSED',
            ),
          )
        } else {
          subscriber.complete()
        }
      }

      ws.onopen = onOpen
      ws.onclose = onClose
      ws.onerror = onError

      return () => {
        didUnsubscribe = true
        ws.close(1000, 'WebSockets connection closed by client')
      }
    })
  }
}
