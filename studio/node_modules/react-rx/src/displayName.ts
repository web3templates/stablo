const getDisplayName = (Component: any) => {
  if (typeof Component === 'string') {
    return Component
  }

  return (Component && (Component.displayName || Component.name)) || 'Unknown'
}

export const wrapDisplayName = (BaseComponent: Function, wrapperName: string) =>
  `${wrapperName}(${getDisplayName(BaseComponent)})`
