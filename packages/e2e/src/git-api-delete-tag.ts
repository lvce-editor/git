import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.deleteTag'

export const skip = 1

export const test: Test = async ({ Command, FileSystem, Git, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const workspaceDir = `${tmpDir}/workspace`
  const tagName = 'v0.1'

  await Workspace.setPath(tmpDir)
  const fixtureUrl = import.meta.resolve('../fixtures/git-api-delete-tag')
  await Command.executeExtensionCommand('git.loadFixture', fixtureUrl)
  await Workspace.setPath(workspaceDir)

  // act
  await Command.execute('ExtensionHost.executeCommand', 'git.deleteTag', tagName)

  // assert
  try {
    await FileSystem.readFile(`${workspaceDir}/.git/refs/tags/${tagName}`)
    throw new Error(`expected tag ${tagName} to be deleted`)
  } catch {
    // expected: reading the deleted tag ref should fail
  }
  await Git.shouldHaveInvocations([
    {
      command: ['git', 'tag', '-d', tagName],
      cwd: workspaceDir,
    },
  ])
}
