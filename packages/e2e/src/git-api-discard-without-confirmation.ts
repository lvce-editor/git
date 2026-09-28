import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.discard-without-confirmation'

export const test: Test = async ({ Command, FileSystem, Git, Settings, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const workspaceDir = `${tmpDir}/workspace`
  const fileName = 'file.txt'

  await Workspace.setUri(tmpDir)
  const fixtureUrl = import.meta.resolve('../fixtures/git-api-branch')
  await Command.execute('ExtensionHost.executeCommand', 'git.loadFixture', fixtureUrl)
  await Workspace.setUri(workspaceDir)
  await Settings.update({
    'git.confirmDiscard': false,
  })
  await FileSystem.writeFile(`${workspaceDir}/${fileName}`, 'modified content')

  // act
  await Command.execute('ExtensionHost.executeCommand', 'git.discard', fileName)

  // assert
  await FileSystem.shouldHaveFile(`${workspaceDir}/${fileName}`, 'main branch')
  await Git.shouldHaveInvocations([
    {
      command: ['git', 'status', '--porcelain', '-uall'],
      cwd: decodeURIComponent(new URL(workspaceDir).pathname).replace(/^\/(?=[A-Za-z]:)/, ''),
    },
    {
      command: ['git', 'restore', '--', fileName],
      cwd: decodeURIComponent(new URL(workspaceDir).pathname).replace(/^\/(?=[A-Za-z]:)/, ''),
    },
  ])
}
