import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.merge'

export const skip = 1

export const test: Test = async ({ Command, FileSystem, Git, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const workspaceDir = `${tmpDir}/target`
  const sourceDir = `${tmpDir}/source`

  await Workspace.setPath(tmpDir)
  await FileSystem.mkdir(workspaceDir)
  await FileSystem.writeFile(`${workspaceDir}/base.txt`, 'base')
  await FileSystem.mkdir(sourceDir)
  await FileSystem.writeFile(`${sourceDir}/added.txt`, 'merged content')
  await Git.init({
    initialBranch: 'main',
    uri: workspaceDir,
  })
  await Git.init({
    initialBranch: 'main',
    uri: sourceDir,
  })
  await Workspace.setPath(workspaceDir)

  // act
  await Command.execute('ExtensionHost.executeCommand', 'git.merge', 'source/main')

  // assert
  await FileSystem.shouldHaveFile(`${workspaceDir}/added.txt`, 'merged content')
}
