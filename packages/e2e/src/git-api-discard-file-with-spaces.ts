import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.discard-file-with-spaces'

export const test: Test = async ({ Command, FileSystem, Git, Settings, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const fileName = 'release notes.txt'
  await Workspace.setPath(tmpDir)
  await Git.init()
  await Git.setConfig('user.name', 'Test User')
  await Git.setConfig('user.email', 'test@example.com')
  await FileSystem.writeFile(`${tmpDir}/${fileName}`, 'original')
  await Git.add(fileName)
  await Git.commit('add notes')
  await FileSystem.writeFile(`${tmpDir}/${fileName}`, 'modified')
  await Settings.update({ 'git.confirmDiscard': false })

  await Command.execute('ExtensionHost.executeCommand', 'git.discard', fileName)

  await FileSystem.shouldHaveFile(`${tmpDir}/${fileName}`, 'original')
}
