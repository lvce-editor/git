import { packageExtension } from '@lvce-editor/package-extension'
import fs, { readFileSync, writeFileSync } from 'fs'
import { readdir, rm } from 'fs/promises'
import path, { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const extension = path.join(root, 'packages', 'extension')
const gitWorker = path.join(root, 'packages', 'git-worker')
const gitArgs = path.join(root, 'packages', 'git-args')
const node = path.join(root, 'packages', 'node')

fs.rmSync(join(root, 'dist'), { recursive: true, force: true })

fs.mkdirSync(path.join(root, 'dist'))

const packageJson = JSON.parse(readFileSync(join(extension, 'package.json')).toString())
delete packageJson.jest
delete packageJson.devDependencies
delete packageJson.scripts

fs.writeFileSync(join(root, 'dist', 'package.json'), JSON.stringify(packageJson, null, 2) + '\n')
fs.copyFileSync(join(root, 'README.md'), join(root, 'dist', 'README.md'))
fs.copyFileSync(join(extension, 'icon.png'), join(root, 'dist', 'icon.png'))
fs.copyFileSync(join(extension, 'extension.json'), join(root, 'dist', 'extension.json'))
fs.cpSync(join(extension, 'icons'), join(root, 'dist', 'icons'), { recursive: true })
fs.cpSync(join(extension, 'src'), join(root, 'dist', 'src'), {
  recursive: true,
})

fs.cpSync(join(gitWorker, 'src'), join(root, 'dist', 'git-worker', 'src'), {
  recursive: true,
})
fs.cpSync(join(gitArgs, 'src'), join(root, 'dist', 'git-args', 'src'), {
  recursive: true,
})
fs.cpSync(join(gitArgs, 'src'), join(root, 'dist', 'git-requests', 'src'), {
  recursive: true,
})

fs.cpSync(node, join(root, 'dist', 'node'), {
  recursive: true,
  verbatimSymlinks: true,
})

const replace = ({ path, occurrence, replacement }) => {
  const oldContent = readFileSync(path, 'utf-8')
  const newContent = oldContent.replace(occurrence, replacement)
  writeFileSync(path, newContent)
}

replace({
  path: join(root, 'dist', 'src', 'parts', 'GetGitClientPath', 'GetGitClientPath.js'),
  occurrence: '../node/',
  replacement: 'node/',
})

replace({
  path: join(root, 'dist', 'src', 'parts', 'GitWorkerUrl', 'GitWorkerUrl.js'),
  occurrence: '../git-worker/',
  replacement: 'git-worker/',
})

replace({
  path: join(root, 'dist', 'git-worker', 'src', 'parts', 'IconRoot', 'IconRoot.js'),
  occurrence: '/extension',
  replacement: '',
})

await rm(join(root, 'dist', 'node', 'node_modules', '.bin'), { recursive: true, force: true })
await rm(join(root, 'dist', 'node', 'node_modules', 'which', 'bin'), { recursive: true, force: true })

const shouldRemoveNodeModule = (dirent) => {
  return dirent.endsWith('test') || dirent.endsWith('.d.ts') || dirent.endsWith('.npmignore') || dirent.endsWith('CHANGELOG.md')
}

const dirents = await readdir(join(root, 'dist', 'node', 'node_modules'), { recursive: true })
for (const dirent of dirents) {
  if (shouldRemoveNodeModule(dirent)) {
    const absolutePath = join(root, 'dist', 'node', 'node_modules', dirent)
    await rm(absolutePath, { recursive: true, force: true })
  }
}

await packageExtension({
  highestCompression: true,
  inDir: join(root, 'dist'),
  outFile: join(root, 'extension.tar.br'),
})
