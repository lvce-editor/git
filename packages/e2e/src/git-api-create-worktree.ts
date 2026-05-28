/* eslint-disable @cspell/spellchecker */
import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.createWorktree'

// export const skip = 1

export const test: Test = async ({ Command, FileSystem, Git, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const workspaceDir = `${tmpDir}/workspace`
  const worktreeDir = `${tmpDir}/feature-worktree`

  await Workspace.setPath(tmpDir)
  const fixtureUrl = import.meta.resolve('../fixtures/git-api-create-worktree')
  await Command.execute('ExtensionHost.executeCommand', 'git.loadFixture', fixtureUrl)
  await Workspace.setPath(workspaceDir)

  // act
  await Command.execute('ExtensionHost.executeCommand', 'git.createWorktree', worktreeDir)

  // assert
  await FileSystem.shouldHaveFolder(worktreeDir)
  await FileSystem.shouldHaveFile(`${worktreeDir}/file.txt`, 'main branch')
  const gitFileContent = await FileSystem.readFile(`${worktreeDir}/.git`)
  if (!gitFileContent.includes('.git/worktrees/')) {
    throw new Error(`expected worktree git file to point to worktree metadata, got ${gitFileContent}`)
  }
  await Git.shouldHaveInvocations([
    {
      command: ['git', 'worktree', 'add', worktreeDir],
      cwd: workspaceDir,
    },
  ])
}
