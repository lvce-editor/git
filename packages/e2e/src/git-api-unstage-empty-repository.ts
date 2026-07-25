import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.unstage-empty-repository'

export const test: Test = async ({ FileSystem, Git, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const fileName = 'first.txt'

  await Workspace.setPath(tmpDir)
  await Git.init()
  await FileSystem.writeFile(`${tmpDir}/${fileName}`, 'first')
  await Git.add(fileName)

  await Git.unstage(fileName)

  const indexContent = await FileSystem.readFile(`${tmpDir}/.git/index`)
  if (indexContent.includes(fileName)) {
    throw new Error(`expected ${fileName} to be removed from git index`)
  }
}
