import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.unstage-unicode-file'

export const test: Test = async ({ FileSystem, Git, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const fileName = 'café-文件.txt'

  await Workspace.setPath(tmpDir)
  await Git.init()
  await Git.setConfig('user.name', 'Test User')
  await Git.setConfig('user.email', 'test@example.com')
  await FileSystem.writeFile(`${tmpDir}/tracked.txt`, 'tracked')
  await Git.add('tracked.txt')
  await Git.commit('initial')
  await FileSystem.writeFile(`${tmpDir}/${fileName}`, 'first')
  await Git.add(fileName)

  await Git.unstage(fileName)

  const indexContent = await FileSystem.readFile(`${tmpDir}/.git/index`)
  if (indexContent.includes(fileName)) {
    throw new Error(`expected ${fileName} to be removed from git index`)
  }
}
