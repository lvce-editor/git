import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.create-worktree-nested-path'

export const test: Test = async ({ FileSystem, Git, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const worktreeParent = `${tmpDir}/worktrees`
  const worktreeDir = `${worktreeParent}/feature`

  await Workspace.setPath(tmpDir)
  await Git.init({ initialBranch: 'main' })
  await Git.setConfig('user.name', 'Test User')
  await Git.setConfig('user.email', 'test@example.com')
  await FileSystem.writeFile(`${tmpDir}/file.txt`, 'main')
  await Git.add('file.txt')
  await Git.commit('initial')
  await Git.branch('feature')
  await FileSystem.mkdir(worktreeParent)

  await Git.createWorktree(worktreeDir, 'feature')

  await FileSystem.shouldHaveFolder(worktreeDir)
  await FileSystem.shouldHaveFile(`${worktreeDir}/file.txt`, 'main')
}
