import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.discard-tracked-file'

export const test: Test = async ({ Command, Dialog, expect, FileSystem, Git, Locator, Main, Settings, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const workspaceDir = `${tmpDir}/workspace`
  const fileName = 'file.txt'

  await Workspace.setUri(tmpDir)
  const fixtureUrl = import.meta.resolve('../fixtures/git-api-branch')
  await Command.execute('ExtensionHost.executeCommand', 'git.loadFixture', fixtureUrl)
  await Workspace.setUri(workspaceDir)
  await Settings.update({
    'git.confirmDiscard': true,
  })
  await Dialog.mockConfirm(() => true)
  await FileSystem.writeFile(`${workspaceDir}/${fileName}`, 'modified content')
  await Main.openUri(`${workspaceDir}/${fileName}`)
  const editor = Locator('.Editor')
  await expect(editor).toContainText('modified content')

  // act
  await Command.execute('ExtensionHost.executeCommand', 'git.discard', fileName)

  // assert
  await FileSystem.shouldHaveFile(`${workspaceDir}/${fileName}`, 'main branch')
  await expect(editor).toContainText('main branch')
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
