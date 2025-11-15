import fs from 'fs'
import path from 'path'

const targets = [
  'src', // ton application
  'designSystem/src', // ton design system ✔
]

const exts = ['.vue', '.less', '.css']

function collectFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return []

  const entries = fs.readdirSync(dir, { withFileTypes: true })
  let files: string[] = []

  for (const e of entries) {
    const full = path.join(dir, e.name)

    if (e.isDirectory()) {
      files = files.concat(collectFiles(full))
    } else if (exts.includes(path.extname(full))) {
      files.push(full)
    }
  }

  return files
}

// Convert fade(@color, 60%) → rgba(var(--color-rgb), 0.6)
function transform(content: string) {
  return content.replace(
    /fade\(@([a-zA-Z0-9_-]+),\s*([0-9]+)%\)/g,
    (_m, varName, percent) => `rgba(var(--${varName}-rgb), ${Number(percent) / 100})`,
  )
}

console.log('🔧 Starting fade() auto-fix for app + Design System...\n')

let total = 0

for (const target of targets) {
  const files = collectFiles(target)

  for (const file of files) {
    const original = fs.readFileSync(file, 'utf8')
    const updated = transform(original)

    if (updated !== original) {
      fs.writeFileSync(file, updated, 'utf8')
      console.log(`✔ Fix applied to: ${file}`)
      total++
    }
  }
}

console.log(`\n🎉 Completed! ${total} file(s) updated.\n`)
