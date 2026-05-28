import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.tag'

export const test: Test = async ({ Command, FileSystem, Git, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const workspaceDir = `${tmpDir}/workspace`
  const tagName = 'v0.1'

  await Workspace.setPath(tmpDir)
  const fixtureUrl = import.meta.resolve('../fixtures/git-api-create-tag')
  await Command.execute('ExtensionHost.executeCommand', 'git.loadFixture', fixtureUrl)
  await Workspace.setPath(workspaceDir)

  // act
  await Command.execute('ExtensionHost.executeCommand', 'git.createTag', tagName)

  // assert
  const headRef = await FileSystem.readFile(`${workspaceDir}/.git/refs/heads/main`)
  const tagRef = await FileSystem.readFile(`${workspaceDir}/.git/refs/tags/${tagName}`)
  if (tagRef !== headRef) {
    throw new Error(`expected tag ref to match HEAD commit, got ${tagRef}`)
  }
  await Git.shouldHaveInvocations([
    {
      command: ['git', 'tag', tagName],
      cwd: workspaceDir,
    },
  ])
}
