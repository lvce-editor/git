import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.stage'

// export const skip = 1

export const test: Test = async ({ Command, FileSystem, Git, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const fileName = 'file.txt'

  await Workspace.setPath(tmpDir)
  await FileSystem.writeFile(`${tmpDir}/${fileName}`, 'staged content')
  await Git.init()

  // act
  await Command.execute('ExtensionHost.executeCommand', 'git.stage', fileName)

  // assert
  const indexContent = await FileSystem.readFile(`${tmpDir}/.git/index`)
  if (!indexContent.includes(fileName)) {
    throw new Error(`expected staged file in git index, got ${indexContent}`)
  }
  await Git.shouldHaveInvocations([
    {
      command: ['git', 'init'],
      cwd: tmpDir,
    },
    {
      command: ['git', 'add', fileName],
      cwd: tmpDir,
    },
  ])
}
