import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.add-file-with-spaces'

export const test: Test = async ({ FileSystem, Git, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const fileName = 'file with spaces.txt'

  await Workspace.setPath(tmpDir)
  await FileSystem.writeFile(`${tmpDir}/${fileName}`, 'spaced path')
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
