import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.create-worktree-path-with-spaces'

export const test: Test = async ({ Command, FileSystem, Git, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const workspaceDir = `${tmpDir}/workspace`
  const worktreeDir = `${tmpDir}/feature worktree`
  await Workspace.setPath(tmpDir)
  await Command.execute('ExtensionHost.executeCommand', 'git.loadFixture', import.meta.resolve('../fixtures/git-api-branch'))
  await Workspace.setPath(workspaceDir)

  await Command.execute('ExtensionHost.executeCommand', 'git.createWorktree', worktreeDir)

  await FileSystem.shouldHaveFolder(worktreeDir)
  await FileSystem.shouldHaveFile(`${worktreeDir}/file.txt`, 'main branch')
  await Git.shouldHaveInvocations([{ command: ['git', 'worktree', 'add', worktreeDir], cwd: workspaceDir }])
}
