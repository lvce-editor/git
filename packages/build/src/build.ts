import fs, { readFileSync, writeFileSync } from 'node:fs'
import { readdir, readFile, writeFile } from 'node:fs/promises'
import path, { join } from 'node:path'
import { bundleJs, packageExtension } from '@lvce-editor/package-extension'
import { buildNodeClient } from './buildNodeClient.ts'
import { root } from './root.ts'

const extension = path.join(root, 'packages', 'extension')
const gitWorker = path.join(root, 'packages', 'git-worker')
const gitRequests = path.join(root, 'packages', 'git-requests')
const gitWeb = path.join(root, 'packages', 'git-web')
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

fs.cpSync(join(gitRequests, 'src'), join(root, 'dist', 'git-requests', 'src'), {
  recursive: true,
})

fs.cpSync(join(gitWeb, 'src'), join(root, 'dist', 'git-web', 'src'), {
  recursive: true,
})

const replace = async ({ path, occurrence, replacement }: { path: string; occurrence: string; replacement: string }): Promise<void> => {
  const oldContent = readFileSync(path, 'utf-8')
  const newContent = oldContent.replace(occurrence, replacement)
  writeFileSync(path, newContent)
}

const updateRelativeJsImportsToTs = async (dir: string): Promise<void> => {
  const dirents = await readdir(dir, { recursive: true, withFileTypes: true })
  for (const dirent of dirents) {
    if (!dirent.isFile() || !dirent.name.endsWith('.ts')) {
      continue
    }
    const absolutePath = join(dirent.parentPath, dirent.name)
    const oldContent = await readFile(absolutePath, 'utf8')
    const newContent = oldContent.replace(/((?:import|export)\s+(?:[^'"]*?\s+from\s+)?['"])(\.\.?\/[^'"]+)\.js(['"])/g, '$1$2.ts$3')
    if (newContent !== oldContent) {
      await writeFile(absolutePath, newContent)
    }
  }
}

await replace({
  path: join(root, 'dist', 'extension.json'),
  occurrence: '../node/src/gitClient.js',
  replacement: 'node/src/gitClient.js',
})

await replace({
  path: join(root, 'dist', 'src', 'gitMain.ts'),
  occurrence: './parts/Main/Main.js',
  replacement: './parts/Main/Main.ts',
})

await updateRelativeJsImportsToTs(join(root, 'dist', 'src'))
await updateRelativeJsImportsToTs(join(root, 'dist', 'git-worker', 'src'))
await updateRelativeJsImportsToTs(join(root, 'dist', 'git-web', 'src'))

await replace({
  path: join(root, 'dist', 'src', 'parts', 'GitWorkerUrl', 'GitWorkerUrl.ts'),
  occurrence: '../git-worker/',
  replacement: 'git-worker/',
})

await replace({
  path: join(root, 'dist', 'src', 'parts', 'GitWorkerUrl', 'GitWorkerUrl.ts'),
  occurrence: 'src/gitWorkerMain.ts',
  replacement: 'dist/gitWorkerMain.js',
})

await replace({
  path: join(root, 'dist', 'git-requests', 'src', 'parts', 'IconRoot', 'IconRoot.ts'),
  occurrence: '/extension',
  replacement: '',
})

await replace({
  path: join(root, 'dist', 'git-requests', 'src', 'parts', 'IconRoot', 'IconRoot.ts'),
  occurrence: 'parts.slice(0, -5)',
  replacement: 'parts.slice(0, -3)',
})

await buildNodeClient(join(root, 'dist', 'node', 'src', 'gitClient.js'))

await bundleJs(join(root, 'dist', 'git-worker', 'src', 'gitWorkerMain.ts'), join(root, 'dist', 'git-worker', 'dist', 'gitWorkerMain.js'), false)

await bundleJs(join(root, 'dist', 'git-web', 'src', 'gitWebMain.ts'), join(root, 'dist', 'git-web', 'dist', 'gitWebMain.js'), false)

await bundleJs(join(root, 'dist', 'src', 'gitMain.ts'), join(root, 'dist', 'dist', 'gitMain.js'), false)

await packageExtension({
  highestCompression: true,
  inDir: join(root, 'dist'),
  outFile: join(root, 'extension.tar.br'),
})
