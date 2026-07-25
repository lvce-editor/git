import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.unstage-all-empty-repository'

export const test: Test = async ({ Command, FileSystem, Git, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const fileNames = ['first.txt', 'second.txt']

  await Workspace.setPath(tmpDir)
  await Git.init()
  await FileSystem.setFiles(
    fileNames.map((fileName) => ({
      content: fileName,
      uri: `${tmpDir}/${fileName}`,
    })),
  )
  await Git.addAll()

  await Command.execute('ExtensionHost.executeCommand', 'git.unstageAll')

  const indexContent = await FileSystem.readFile(`${tmpDir}/.git/index`)
  for (const fileName of fileNames) {
    if (indexContent.includes(fileName)) {
      throw new Error(`expected ${fileName} to be removed from git index`)
    }
  }
}
