import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.deleteRemoteTag'

export const test: Test = async ({ Command, FileSystem, Git, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const workspaceDir = `${tmpDir}/workspace`
  const remoteDir = `${tmpDir}/remote.git`
  const tagName = 'v0.1'

  await Workspace.setPath(tmpDir)
  const fixtureUrl = import.meta.resolve('../fixtures/git-api-delete-remote-tag')
  await Command.execute('ExtensionHost.executeCommand', 'git.loadFixture', fixtureUrl)
  await Workspace.setPath(workspaceDir)

  // act
  await Command.execute('ExtensionHost.executeCommand', 'git.deleteRemoteTag', tagName)

  // assert
  const localTagRef = await FileSystem.readFile(`${workspaceDir}/.git/refs/tags/${tagName}`)
  const localHeadRef = await FileSystem.readFile(`${workspaceDir}/.git/refs/heads/main`)
  await FileSystem.shouldHaveFile(`${remoteDir}/refs/heads/main`, localHeadRef)
  try {
    await FileSystem.readFile(`${remoteDir}/refs/tags/${tagName}`)
    throw new Error(`expected remote tag ${tagName} to be deleted`)
  } catch {
    // expected: reading the deleted remote tag ref should fail
  }
  await FileSystem.shouldHaveFile(`${workspaceDir}/.git/refs/tags/${tagName}`, localTagRef)
  await Git.shouldHaveInvocations([
    {
      command: ['git', 'push', 'origin', `:refs/tags/${tagName}`],
      cwd: workspaceDir,
    },
  ])
}
