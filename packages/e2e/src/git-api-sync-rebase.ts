import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.sync-rebase'

export const test: Test = async ({ Command, FileSystem, Git, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const workspaceDir = `${tmpDir}/workspace`
  const verifyDir = `${tmpDir}/verify`

  await Workspace.setPath(tmpDir)
  const fixtureUrl = import.meta.resolve('../fixtures/git-api-sync-rebase')
  await Command.execute('ExtensionHost.executeCommand', 'git.loadFixture', fixtureUrl)
  await Workspace.setPath(workspaceDir)

  // act
  await Command.execute('ExtensionHost.executeCommand', 'git.syncRebase')

  // assert
  await FileSystem.shouldHaveFile(`${workspaceDir}/remote-file.txt`, 'remote change')
  await FileSystem.shouldHaveFile(`${workspaceDir}/local-file.txt`, 'local change')

  await Workspace.setPath(tmpDir)
  const verifyFixtureUrl = import.meta.resolve('../fixtures/git-api-sync-rebase-verify')
  await Command.execute('ExtensionHost.executeCommand', 'git.loadFixture', verifyFixtureUrl)
  await FileSystem.shouldHaveFile(`${verifyDir}/remote-file.txt`, 'remote change')
  await FileSystem.shouldHaveFile(`${verifyDir}/local-file.txt`, 'local change')

  await Git.shouldHaveInvocations([
    {
      command: ['git', 'pull', '--rebase'],
      cwd: workspaceDir,
    },
    {
      command: ['git', 'push'],
      cwd: workspaceDir,
    },
  ])
}
