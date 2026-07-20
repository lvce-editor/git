import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.discard-cancel'

export const test: Test = async ({ Command, Dialog, FileSystem, Settings, Workspace }) => {
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
  await Dialog.mockConfirm(() => false)
  await FileSystem.writeFile(`${workspaceDir}/${fileName}`, 'modified content')

  // act
  await Command.execute('ExtensionHost.executeCommand', 'git.discard', fileName)

  // assert
  await FileSystem.shouldHaveFile(`${workspaceDir}/${fileName}`, 'modified content')
}
