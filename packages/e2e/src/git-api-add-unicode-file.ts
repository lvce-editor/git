import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.add-unicode-file'

export const test: Test = async ({ FileSystem, Git, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const fileName = 'café-你好.txt'

  await Workspace.setPath(tmpDir)
  await Git.init()
  await FileSystem.writeFile(`${tmpDir}/${fileName}`, 'unicode path')

  await Git.add(fileName)

  const indexContent = await FileSystem.readFile(`${tmpDir}/.git/index`)
  if (!indexContent.includes(fileName)) {
    throw new Error(`expected ${fileName} in git index`)
  }
}
