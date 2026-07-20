import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.discard-tracked-file'

export const test: Test = async ({ Command, Dialog, FileSystem, Git, Settings, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const workspaceDir = `${tmpDir}/workspace`
  const fileName = 'file.txt'

  await Workspace.setPath(tmpDir)
  const fixtureUrl = import.meta.resolve('../fixtures/git-api-branch')
  await Command.execute('ExtensionHost.executeCommand', 'git.loadFixture', fixtureUrl)
  await Workspace.setPath(workspaceDir)
  await Settings.update({
    'git.confirmDiscard': true,
  })
  await Dialog.mockConfirm(() => true)
  await FileSystem.writeFile(`${workspaceDir}/${fileName}`, 'modified content')

  // act
  await Command.execute('ExtensionHost.executeCommand', 'git.discard', fileName)

  // assert
  await FileSystem.shouldHaveFile(`${workspaceDir}/${fileName}`, 'main branch')
  await Git.shouldHaveInvocations([
    {
      command: ['git', 'status', '--porcelain', '-uall'],
      cwd: workspaceDir,
    },
    {
      command: ['git', 'restore', '--', fileName],
      cwd: workspaceDir,
    },
  ])
}
