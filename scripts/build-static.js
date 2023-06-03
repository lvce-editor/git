import { exportStatic } from '@lvce-editor/shared-process'
import { readFileSync, writeFileSync } from 'node:fs'
import { cp, readdir } from 'node:fs/promises'
import path, { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')

await exportStatic({
  extensionPath: 'packages/extension',
  testPath: 'packages/e2e',
  root,
})

const RE_COMMIT_HASH = /^[a-z\d]+$/
const isCommitHash = (dirent) => {
  return dirent.length === 7 && dirent.match(RE_COMMIT_HASH)
}

const dirents = await readdir(path.join(root, 'dist'))
const commitHash = dirents.find(isCommitHash) || ''

for (const dirent of ['src']) {
  await cp(
    path.join(root, 'packages', 'git-worker', dirent),
    path.join(root, 'dist', commitHash, 'extensions', 'builtin.git', 'git-worker', dirent),
    { recursive: true, force: true }
  )
}

const replace = ({ path, occurrence, replacement }) => {
  const oldContent = readFileSync(path, 'utf-8')
  const newContent = oldContent.replace(occurrence, replacement)
  writeFileSync(path, newContent)
}

replace({
  path: join(root, 'dist', commitHash, 'extensions', 'builtin.git', 'src', 'parts', 'GitWorkerUrl', 'GitWorkerUrl.js'),
  occurrence: '../git-worker/',
  replacement: 'git-worker/',
})
