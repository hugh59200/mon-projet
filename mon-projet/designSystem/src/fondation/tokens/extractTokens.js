import { promises as fs } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import chokidar from 'chokidar'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const tokensDir = path.join(__dirname, '@designSystem/fondation')
const outputFilePath = path.join(__dirname, '@designSystem/fondation/tokens/tokens.json')

const extractVariables = (data) => {
  const variableRegex = /@([\w-]+):\s*(.*?);/g
  const variables = {}
  let match

  while ((match = variableRegex.exec(data)) !== null) {
    variables[match[1]] = match[2].trim()
  }

  return variables
}

const processFiles = async () => {
  try {
    const directories = await fs.readdir(tokensDir, { withFileTypes: true })
    const allTokens = {}

    for (const dir of directories) {
      if (dir.isDirectory()) {
        const dirPath = path.join(tokensDir, dir.name)
        const tokenFiles = await fs.readdir(dirPath)
        const tokens = {}

        for (const file of tokenFiles) {
          if (file.endsWith('.less') && !file.includes('mixin') && file.includes('token')) {
            const filePath = path.join(dirPath, file)
            const fileContent = await fs.readFile(filePath, 'utf8')
            tokens[file.replace('.less', '')] = extractVariables(fileContent)
          }
        }

        allTokens[dir.name] = tokens
      }
    }

    await fs.writeFile(outputFilePath, JSON.stringify(allTokens, null, 2))
    console.log('Tokens extracted successfully.')
  } catch (error) {
    console.error('Error processing files:', error)
  }
}

const startWatching = () => {
  chokidar.watch(tokensDir).on('change', (filePath) => {
    console.log(`${filePath} has been changed. Reprocessing...`)
    processFiles()
  })
}

processFiles().then(startWatching)
