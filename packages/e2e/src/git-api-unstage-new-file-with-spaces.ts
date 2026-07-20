import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.unstage-new-file-with-spaces'

export const test: Test = async ({ Command, FileSystem, Git, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const workspaceDir = `${tmpDir}/workspace`
  const fileName = 'new file.txt'

  await Workspace.setPath(tmpDir)
  const fixtureUrl = import.meta.resolve('../fixtures/git-api-branch')
  await Command.execute('ExtensionHost.executeCommand', 'git.loadFixture', fixtureUrl)
  await Workspace.setPath(workspaceDir)
  await FileSystem.writeFile(`${workspaceDir}/${fileName}`, 'new content')
  await Git.add(fileName)

  // act
  await Git.unstage(fileName)

  // assert
  const indexContent = await FileSystem.readFile(`${workspaceDir}/.git/index`)
  if (indexContent.includes(fileName)) {
    throw new Error(`expected ${fileName} to be removed from git index`)
  }
  await Git.shouldHaveInvocations([
    {
      command: ['git', 'restore', '--staged', '--', fileName],
      cwd: workspaceDir,
    },
  ])
}
