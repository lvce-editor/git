import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.stage-deleted-file'

export const test: Test = async ({ FileSystem, Git, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const fileName = 'deleted.txt'

  await Workspace.setPath(tmpDir)
  await Git.init()
  await Git.setConfig('user.name', 'Test User')
  await Git.setConfig('user.email', 'test@example.com')
  await FileSystem.writeFile(`${tmpDir}/${fileName}`, 'tracked')
  await Git.add(fileName)
  await Git.commit('initial')
  await FileSystem.deleteFile(`${tmpDir}/${fileName}`)

  await Git.stage(fileName)
  await Git.commit('delete file')

  await Git.shouldHaveCommit('delete file')
  const entries = await FileSystem.readDir(tmpDir)
  if (entries.some((entry) => entry.name === fileName)) {
    throw new Error(`expected ${fileName} to remain deleted`)
  }
}
