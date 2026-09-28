import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.unstage-tracked-file'

export const test: Test = async ({ Command, FileSystem, Git, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const workspaceDir = `${tmpDir}/workspace`
  const fileName = 'file.txt'

  await Workspace.setUri(tmpDir)
  const fixtureUrl = import.meta.resolve('../fixtures/git-api-branch')
  await Command.execute('ExtensionHost.executeCommand', 'git.loadFixture', fixtureUrl)
  await Workspace.setUri(workspaceDir)
  await FileSystem.writeFile(`${workspaceDir}/${fileName}`, 'modified content')
  await Git.add(fileName)

  // act
  await Git.unstage(fileName)

  // assert
  await FileSystem.shouldHaveFile(`${workspaceDir}/${fileName}`, 'modified content')
  await Git.shouldHaveInvocations([
    {
      command: ['git', 'restore', '--staged', '--', fileName],
      cwd: decodeURIComponent(new URL(workspaceDir).pathname).replace(/^\/(?=[A-Za-z]:)/, ''),
    },
  ])
}
