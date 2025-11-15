import fs from 'fs'
import path from 'path'

const palettes = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), 'src/themes/palettes/palettes.json'), 'utf8'),
)

const toRgb = (hex: string) => {
  hex = hex.replace('#', '')
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)
  return `${r},${g},${b}`
}

Object.entries(palettes).forEach(([name, colors]) => {
  let out = `:root[data-palette="${name}"] {\n`

  Object.entries(colors as Record<string, string>).forEach(([token, value]) => {
    const rgb = toRgb(value)
    out += `  --${token}: ${value};\n`
    out += `  --${token}-rgb: ${rgb};\n`
  })

  out += `}\n`

  const file = path.join(process.cwd(), `src/themes/palettes/palette.${name}.css`)
  fs.writeFileSync(file, out, 'utf8')
  console.log(`Generated: palette.${name}.css`)
})
