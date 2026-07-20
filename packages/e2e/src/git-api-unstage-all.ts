import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.unstage-all'

export const test: Test = async ({ Command, FileSystem, Git, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const workspaceDir = `${tmpDir}/workspace`
  const newFileName = 'new.txt'

  await Workspace.setPath(tmpDir)
  const fixtureUrl = import.meta.resolve('../fixtures/git-api-branch')
  await Command.execute('ExtensionHost.executeCommand', 'git.loadFixture', fixtureUrl)
  await Workspace.setPath(workspaceDir)
  await FileSystem.setFiles([
    {
      content: 'modified content',
      uri: `${workspaceDir}/file.txt`,
    },
    {
      content: 'new content',
      uri: `${workspaceDir}/${newFileName}`,
    },
  ])
  await Command.execute('ExtensionHost.executeCommand', 'git.stageAll')

  // act
  await Command.execute('ExtensionHost.executeCommand', 'git.unstageAll')

  // assert
  const indexContent = await FileSystem.readFile(`${workspaceDir}/.git/index`)
  if (indexContent.includes(newFileName)) {
    throw new Error(`expected ${newFileName} to be removed from git index`)
  }
  await Git.shouldHaveInvocations([
    {
      command: ['git', 'restore', '--staged', '.'],
      cwd: workspaceDir,
    },
  ])
}
