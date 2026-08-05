import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.discard-empty-file'

export const test: Test = async ({ Command, FileSystem, Git, Settings, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const fileName = 'empty.txt'
  await Workspace.setPath(tmpDir)
  await Git.init()
  await Git.setConfig('user.name', 'Test User')
  await Git.setConfig('user.email', 'test@example.com')
  await FileSystem.writeFile(`${tmpDir}/${fileName}`, '')
  await Git.add(fileName)
  await Git.commit('add empty file')
  await FileSystem.writeFile(`${tmpDir}/${fileName}`, 'temporary content')
  await Settings.update({ 'git.confirmDiscard': false })

  await Command.execute('ExtensionHost.executeCommand', 'git.discard', fileName)

  await FileSystem.shouldHaveFile(`${tmpDir}/${fileName}`, '')
}
