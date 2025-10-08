// useIconLoader.ts
export function loadIcon(type: 'bold' | 'outline', name: string) {
  switch (type) {
    case 'bold':
      return import(`@designSystem/fondation/icons/bold/${name}.svg`)
    case 'outline':
      return import(`@designSystem/fondation/icons/outline/${name}.svg`)
  }
}
