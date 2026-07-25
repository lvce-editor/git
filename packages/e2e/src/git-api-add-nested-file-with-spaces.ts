import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.add-nested-file-with-spaces'

export const test: Test = async ({ FileSystem, Git, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const folderName = 'nested folder'
  const fileName = `${folderName}/file name.txt`

  await Workspace.setPath(tmpDir)
  await Git.init()
  await FileSystem.mkdir(`${tmpDir}/${folderName}`)
  await FileSystem.writeFile(`${tmpDir}/${fileName}`, 'nested path')

  await Git.add(fileName)

  const indexContent = await FileSystem.readFile(`${tmpDir}/.git/index`)
  if (!indexContent.includes('file name.txt')) {
    throw new Error(`expected ${fileName} in git index`)
  }
}
