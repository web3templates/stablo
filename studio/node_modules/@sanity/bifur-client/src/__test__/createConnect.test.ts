import {createConnect, WebSocket, WebSocketError} from '../createConnect'
import {catchError, take, takeUntil, tap, toArray} from 'rxjs/operators'
import {of, timer} from 'rxjs'

const createMockWS = (): WebSocket => ({
  onclose: null,
  onerror: null,
  onmessage: null,
  onopen: null,
  close(code?: number, reason?: string) {},
})

describe('createConnect', () => {
  it('emits the connection upon successfully open', async () => {
    const mockWs = createMockWS()
    const connect = createConnect(() => mockWs)

    const conn$ = connect('https://mock')
    setTimeout(() => {
      mockWs.onopen!({})
    }, 100)

    await conn$
      .pipe(
        tap(ws => {
          expect(ws).toBe(mockWs)
        }),
        take(1),
      )
      .toPromise()
  })

  it('closes the connection gracefully upon unsubscribe', async () => {
    const mockWs = createMockWS()

    const connect = createConnect(() => mockWs)

    const conn$ = connect('https://mock')

    const closed = new Promise<{code: number; reason: string}>(
      resolve =>
        (mockWs.close = (code: number, reason: string) =>
          resolve({code, reason})),
    )

    const [closeEvent, connection] = await Promise.all([
      closed,
      conn$.pipe(takeUntil(timer(100))).toPromise(),
    ])

    expect(closeEvent.code).toBe(1000)

    // we expect undefined here since onopen didn't happen before close
    expect(connection).toBeUndefined()
  })

  it('throws a connection error if the connection emits an error', async () => {
    const mockWs = createMockWS()
    const connect = createConnect(() => mockWs)

    const conn$ = connect('https://mock')

    setTimeout(() => {
      mockWs.onerror!({})
    }, 10)

    const res = await conn$
      .pipe(
        catchError((err: WebSocketError) => of(err)),
        toArray(),
      )
      .toPromise()

    expect(res.length).toBe(1)
    expect(res[0]).toBeInstanceOf(Error)
    expect((<WebSocketError>res[0]).code).toEqual('CONNECTION_ERROR')
  })

  it('throws an error on unexpected close', async () => {
    const mockWs = createMockWS()
    const connect = createConnect(() => mockWs)

    const conn$ = connect('https://mock')

    setTimeout(() => {
      mockWs.onclose!({
        reason: 'Unexpected close',
        code: 1006,
        wasClean: false,
      } as CloseEvent)
    }, 10)

    const res = await conn$
      .pipe(
        catchError((err: WebSocketError) => of(err)),
        toArray(),
      )
      .toPromise()

    expect(res.length).toBe(1)
    expect(res[0]).toBeInstanceOf(Error)
    expect((<WebSocketError>res[0]).code).toEqual('CONNECTION_CLOSED')
  })
})
