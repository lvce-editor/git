import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.stage-all'

export const test: Test = async ({ Command, FileSystem, Git, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const fileNames = ['alpha.txt', 'beta.txt']

  await Workspace.setPath(tmpDir)
  await FileSystem.setFiles(
    fileNames.map((fileName) => ({
      content: `${fileName} content`,
      uri: `${tmpDir}/${fileName}`,
    })),
  )
  await Git.init()

  // act
  await Command.execute('ExtensionHost.executeCommand', 'git.stageAll')

  // assert
  const indexContent = await FileSystem.readFile(`${tmpDir}/.git/index`)
  for (const fileName of fileNames) {
    if (!indexContent.includes(fileName)) {
      throw new Error(`expected ${fileName} in git index`)
    }
  }
  await Git.shouldHaveInvocations([
    {
      command: ['git', 'add', '.'],
      cwd: tmpDir,
    },
  ])
}
