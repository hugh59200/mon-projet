import { readdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

const root = process.argv[2] ?? '.'
const pattern =
  /color-mix\(in\s+srgb,\s*var\(--(primary|secondary)-(\d+)\)\s+(\d+)%\s*,\s*transparent\)/gi
const exts = new Set(['.vue', '.less', '.css'])

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = []
  for (const entry of entries) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...(await walk(full)))
    } else if (exts.has(path.extname(entry.name))) {
      files.push(full)
    }
  }
  return files
}

function formatAlpha(percent) {
  const alpha = (Number(percent) / 100).toFixed(2).replace(/0+$/, '').replace(/\.$/, '')
  return alpha.length ? alpha : '0'
}

async function processFile(file) {
  const text = await readFile(file, 'utf8')
  if (!text.includes('color-mix')) return 0
  let hits = 0
  const replaced = text.replace(pattern, (_, palette, tone, percent) => {
    hits += 1
    return `rgba(var(--${palette.toLowerCase()}-${tone}-rgb), ${formatAlpha(percent)})`
  })
  if (hits) {
    await writeFile(file, replaced, 'utf8')
  }
  return hits
}

const files = await walk(root)
let totalFiles = 0
for (const file of files) {
  const hits = await processFile(file)
  if (hits) {
    totalFiles += 1
    console.log(`${file}: ${hits}`)
  }
}
console.log(`Total files updated: ${totalFiles}`)
