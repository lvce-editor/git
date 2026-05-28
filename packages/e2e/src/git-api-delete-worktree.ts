/* eslint-disable @cspell/spellchecker */
import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.deleteWorktree'

export const skip = 1

export const test: Test = async ({ Command, FileSystem, Git, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const workspaceDir = `${tmpDir}/workspace`
  const worktreeDir = `${tmpDir}/feature-worktree`

  await Workspace.setPath(tmpDir)
  const fixtureUrl = import.meta.resolve('../fixtures/git-api-delete-worktree')
  await Command.execute('ExtensionHost.executeCommand', 'git.loadFixture', fixtureUrl)
  await Workspace.setPath(workspaceDir)

  // act
  await Command.execute('ExtensionHost.executeCommand', 'git.deleteWorktree', worktreeDir)

  // assert
  const tmpDirEntries = await FileSystem.readDir(tmpDir)
  if (tmpDirEntries.some((dirent) => dirent.name === 'feature-worktree')) {
    throw new Error(`expected worktree folder to be removed`)
  }
  const gitDirEntries = await FileSystem.readDir(`${workspaceDir}/.git/worktrees`)
  if (gitDirEntries.length > 0) {
    throw new Error(`expected worktree metadata to be removed, got ${gitDirEntries.map((dirent) => dirent.name).join(', ')}`)
  }
  await Git.shouldHaveInvocations([
    {
      command: ['git', 'worktree', 'remove', worktreeDir],
      cwd: workspaceDir,
    },
  ])
}
