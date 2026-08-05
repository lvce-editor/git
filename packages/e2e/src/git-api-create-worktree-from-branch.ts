import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.create-worktree-from-branch'

export const test: Test = async ({ Command, FileSystem, Git, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const workspaceDir = `${tmpDir}/workspace`
  const worktreeDir = `${tmpDir}/feature-worktree`
  await Workspace.setPath(tmpDir)
  await Command.execute('ExtensionHost.executeCommand', 'git.loadFixture', import.meta.resolve('../fixtures/git-api-branch'))
  await Workspace.setPath(workspaceDir)
  await Git.branch('feature')

  await Git.createWorktree(worktreeDir, 'feature')

  await FileSystem.shouldHaveFile(`${worktreeDir}/file.txt`, 'main branch')
  const gitFile = await FileSystem.readFile(`${worktreeDir}/.git`)
  if (!gitFile.includes('.git/worktrees/feature-worktree')) {
    throw new Error(`expected linked worktree metadata, got ${gitFile}`)
  }
}
