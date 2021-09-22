import {NotFoundPage} from './NotFound'

export interface Page {
  id: string
  title: string
  route: string
  load: () => Promise<React.ComponentType<any>>
}

function get<T extends {}, K extends keyof T>(key: K): (res: T) => T[K] {
  return (res: T) => res[key]
}

export const pages: Page[] = [
  {
    id: 'home',
    title: 'Home',
    route: '/',
    load: () => import('./Index/IndexPage').then(get('IndexPage'))
  },
  {
    id: 'guide',
    title: 'Guide',
    route: '/guide',
    load: () => import('./Guide/GuidePage').then(get('GuidePage'))
  },
  {
    id: 'api',
    title: 'API',
    route: '/api',
    load: () => import('./Api/ApiPage').then(get('ApiPage'))
  },
  {
    id: 'examples',
    title: 'Examples',
    route: '/examples',
    load: () => import('./Examples/ExamplesPage').then(get('ExamplesPage'))
  }
]

export const NOT_FOUND: Page = {
  id: 'not-found',
  title: 'Not found',
  route: '',
  load: () => Promise.resolve(NotFoundPage)
}
