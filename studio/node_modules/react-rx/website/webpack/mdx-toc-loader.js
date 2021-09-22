const mdx = require('@mdx-js/mdx')
const toc = require('markdown-toc')
const slug = require('remark-slug')
const ghSlugger = require('github-slugger')
const emoji = require('remark-emoji')

const slugify = ghSlugger()

module.exports = async function MdxTocLoader(src) {
  const callback = this.async()

  if (!callback) {
    return
  }

  const mdxConfig = {
    skipExport: true,
    remarkPlugins: [emoji, slug]
  }

  const tocResult = toc(src, {slugify})

  const compiled = mdx(src, mdxConfig)
  const compiledToc = mdx(tocResult.content, mdxConfig)

  const code = `/* @jsx mdx */
import React from 'react';
import { mdx } from '@mdx-js/react'
export default ${iife(await compiled)};
export const Toc = ${iife(await compiledToc)}
`
  return callback(null, code)
}

function iife(body) {
  return `(function() {${body}
return MDXContent})()`
}
