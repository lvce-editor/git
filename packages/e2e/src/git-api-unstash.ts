import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.unstash'

export const test: Test = async ({ Command, FileSystem, Git, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const workspaceDir = `${tmpDir}/workspace`

  await Workspace.setPath(tmpDir)
  const fixtureUrl = import.meta.resolve('../fixtures/git-api-stash')
  await Command.execute('ExtensionHost.executeCommand', 'git.loadFixture', fixtureUrl)
  await Workspace.setPath(workspaceDir)
  await Git.stash()

  // act
  await Git.unstash()

  // assert
  await FileSystem.shouldHaveFile(`${workspaceDir}/file.txt`, 'modified content')
  await Git.shouldHaveInvocations([
    {
      command: ['git', 'stash', 'push'],
      cwd: workspaceDir,
    },
    {
      command: ['git', 'stash', 'pop'],
      cwd: workspaceDir,
    },
  ])
}
