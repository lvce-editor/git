import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.create-worktree-from-tag'

export const test: Test = async ({ FileSystem, Git, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const worktreeDir = `${tmpDir}/tag-worktree`

  await Workspace.setPath(tmpDir)
  await Git.init({ initialBranch: 'main' })
  await Git.setConfig('user.name', 'Test User')
  await Git.setConfig('user.email', 'test@example.com')
  await FileSystem.writeFile(`${tmpDir}/file.txt`, 'tagged content')
  await Git.add('file.txt')
  await Git.commit('initial')
  await Git.createTag('v1')

  await Git.createWorktree(worktreeDir, 'v1')

  await FileSystem.shouldHaveFolder(worktreeDir)
  await FileSystem.shouldHaveFile(`${worktreeDir}/file.txt`, 'tagged content')
  const gitFile = await FileSystem.readFile(`${worktreeDir}/.git`)
  if (!gitFile.includes('.git/worktrees/')) {
    throw new Error(`expected linked worktree metadata, got ${gitFile}`)
  }
}
