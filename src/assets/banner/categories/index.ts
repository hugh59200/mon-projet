export const images = import.meta.glob<string>('./*.png', {
  eager: true,
  import: 'default',
})

export const bienEtre = images['./bg-bien-etre.png']
export const metabolisme = images['./bg-metabolisme.png']
export const performance = images['./bg-performance.png']
