/**
 * This route is responsible for the built-in authoring environment using Sanity Studio v3.
 * All routes under /studio will be handled by this file using Next.js' catch-all routes:
 * https://nextjs.org/docs/routing/dynamic-routes#catch-all-routes
 *
 * You can learn more about the next-sanity package here:
 * https://github.com/sanity-io/next-sanity
 */

import Studio from './studio'

export const dynamic = 'force-static'

export { metadata } from 'next-sanity/studio/metadata'
export { viewport } from 'next-sanity/studio/viewport'

export default function StudioPage() {
  return <Studio />
}