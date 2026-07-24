import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.branch-missing-name'

export const test: Test = async ({ Command, FileSystem, Git, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const workspaceDir = `${tmpDir}/workspace`

  await Workspace.setPath(tmpDir)
  const fixtureUrl = import.meta.resolve('../fixtures/git-api-branch')
  await Command.execute('ExtensionHost.executeCommand', 'git.loadFixture', fixtureUrl)
  await Workspace.setPath(workspaceDir)

  // act
  await Command.execute('ExtensionHost.executeCommand', 'git.branch')

  // assert
  await FileSystem.shouldHaveFile(`${workspaceDir}/.git/HEAD`, 'ref: refs/heads/main\n')
  await Git.shouldHaveInvocations([])
}
