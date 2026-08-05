import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.add-braced-file'

export const test: Test = async ({ FileSystem, Git, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const fileName = 'report{draft}.txt'
  await Workspace.setPath(tmpDir)
  await Git.init()
  await FileSystem.writeFile(`${tmpDir}/${fileName}`, 'draft')

  await Git.add(fileName)

  const index = await FileSystem.readFile(`${tmpDir}/.git/index`)
  if (!index.includes(fileName)) {
    throw new Error('expected braced filename to be staged')
  }
}
