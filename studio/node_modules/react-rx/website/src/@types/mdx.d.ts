declare module '*.md' {
  const MDXComponent: (props: any) => JSX.Element
  export default MDXComponent
  export {MDXComponent as Toc}
}

declare module '*.mdx' {
  const MDXComponent: (props: any) => JSX.Element
  export default MDXComponent
  export {MDXComponent as Toc}
}
