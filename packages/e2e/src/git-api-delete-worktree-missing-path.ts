import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.delete-worktree-missing-path-no-op'

export const test: Test = async ({ FileSystem, Git, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const missingWorktree = `${tmpDir}/missing-worktree`

  await Workspace.setPath(tmpDir)
  await Git.init({ initialBranch: 'main' })

  await Git.deleteWorktree(missingWorktree)

  await FileSystem.shouldHaveFolder(`${tmpDir}/.git`)
  await FileSystem.shouldHaveFile(`${tmpDir}/.git/HEAD`, 'ref: refs/heads/main\n')
}
