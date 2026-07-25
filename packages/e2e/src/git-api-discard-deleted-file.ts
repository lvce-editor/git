import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.discard-deleted-file'

export const test: Test = async ({ Command, Dialog, FileSystem, Git, Settings, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const fileName = 'tracked.txt'

  await Workspace.setPath(tmpDir)
  await Git.init()
  await Git.setConfig('user.name', 'Test User')
  await Git.setConfig('user.email', 'test@example.com')
  await FileSystem.writeFile(`${tmpDir}/${fileName}`, 'tracked content')
  await Git.add(fileName)
  await Git.commit('initial')
  await FileSystem.deleteFile(`${tmpDir}/${fileName}`)
  await Settings.update({
    'git.confirmDiscard': true,
  })
  await Dialog.mockConfirm(() => true)

  await Command.execute('ExtensionHost.executeCommand', 'git.discard', fileName)

  await FileSystem.shouldHaveFile(`${tmpDir}/${fileName}`, 'tracked content')
}
