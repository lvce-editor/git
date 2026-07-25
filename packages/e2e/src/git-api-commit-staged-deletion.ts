import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.commit-staged-deletion'

export const test: Test = async ({ Command, FileSystem, Git, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const deletedFile = 'deleted.txt'

  await Workspace.setPath(tmpDir)
  await Git.init()
  await Git.setConfig('user.name', 'Test User')
  await Git.setConfig('user.email', 'test@example.com')
  await FileSystem.setFiles([
    { content: 'delete me', uri: `${tmpDir}/${deletedFile}` },
    { content: 'keep me', uri: `${tmpDir}/kept.txt` },
  ])
  await Git.addAll()
  await Git.commit('initial')
  await FileSystem.deleteFile(`${tmpDir}/${deletedFile}`)
  await Git.stage(deletedFile)

  await Command.execute('ExtensionHost.executeCommand', 'git.commitStaged', 'remove deleted file')

  await Git.shouldHaveCommit('remove deleted file')
  await FileSystem.shouldHaveFile(`${tmpDir}/kept.txt`, 'keep me')
}
