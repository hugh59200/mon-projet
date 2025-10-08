export function getCurrentBreakpoint(): 'mobile' | 'tablet' | 'desktop' {
  const screenWidth = window.innerWidth

  if (screenWidth < 720) return 'mobile'
  if (screenWidth < 1089) return 'tablet'
  return 'desktop'
}
