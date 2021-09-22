import {BifurClient, SanityClientLike} from './types'
import {createClient} from './createClient'
import {createConnect} from './createConnect'
import {timeoutFirstWith} from './operators'
import {shareReplay, takeUntil} from 'rxjs/operators'
import {throwError, fromEvent} from 'rxjs'

const connect = createConnect<WebSocket>(
  (url: string, protocols?: string | string[]) =>
    new window.WebSocket(url, protocols),
)

interface Options {
  timeout?: number
}

const id = <T>(arg: T): T => arg

export {BifurClient}

export function fromUrl(url: string, options: Options = {}): BifurClient {
  return createClient(
    connect(url).pipe(
      options.timeout
        ? timeoutFirstWith(
            options.timeout,
            throwError(
              new Error(
                `Timeout after ${options.timeout} while establishing WebSockets connection`,
              ),
            ),
          )
        : id,
      shareReplay({refCount: true}),
      takeUntil(fromEvent(window, 'beforeunload')), // ensure graceful disconnect
    ),
  )
}

export function fromSanityClient(client: SanityClientLike): BifurClient {
  const {dataset} = client.config()
  return fromUrl(client.getUrl(`/socket/${dataset}`).replace(/^http/, 'ws'))
}
