import { exportStatic } from '@lvce-editor/shared-process'
import { cp, readdir } from 'node:fs/promises'
import path from 'node:path'
import { root } from './root.ts'

await import('./build.ts')

await cp(path.join(root, 'dist'), path.join(root, 'dist2'), {
  recursive: true,
  force: true,
})

await exportStatic({
  extensionPath: 'packages/extension',
  testPath: 'packages/e2e',
  root,
})

const RE_COMMIT_HASH = /^[a-z\d]+$/
const isCommitHash = (dirent: string): boolean => {
  return dirent.length === 7 && dirent.match(RE_COMMIT_HASH) !== null
}

const dirents = await readdir(path.join(root, 'dist'))
const commitHash = dirents.find(isCommitHash) || ''

await cp(path.join(root, 'dist2'), path.join(root, 'dist', commitHash, 'extensions', 'builtin.git'), { recursive: true, force: true })
