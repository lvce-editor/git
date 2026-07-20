import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.add-nested-file'

export const test: Test = async ({ FileSystem, Git, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const folderName = 'nested'
  const fileName = `${folderName}/file.txt`

  await Workspace.setPath(tmpDir)
  await FileSystem.mkdir(`${tmpDir}/${folderName}`)
  await FileSystem.writeFile(`${tmpDir}/${fileName}`, 'nested content')
  await Git.init()

  // act
  await Git.add(fileName)

  // assert
  const indexContent = await FileSystem.readFile(`${tmpDir}/.git/index`)
  if (!indexContent.includes(fileName)) {
    throw new Error(`expected ${fileName} in git index`)
  }
  await Git.shouldHaveInvocations([
    {
      command: ['git', 'add', fileName],
      cwd: tmpDir,
    },
  ])
}
