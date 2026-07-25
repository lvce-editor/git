import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.discard-untracked-file'

export const test: Test = async ({ Command, Dialog, FileSystem, Git, Settings, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const fileName = 'untracked.txt'

  await Workspace.setPath(tmpDir)
  await Git.init()
  await Settings.update({
    'git.confirmDiscard': true,
  })
  await Dialog.mockConfirm(() => true)
  await FileSystem.writeFile(`${tmpDir}/${fileName}`, 'untracked')

  await Command.execute('ExtensionHost.executeCommand', 'git.discard', fileName)

  const entries = await FileSystem.readDir(tmpDir)
  if (entries.some((entry) => entry.name === fileName)) {
    throw new Error(`expected ${fileName} to be removed`)
  }
}
