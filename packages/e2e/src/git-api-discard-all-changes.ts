import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.discard-all-changes'

export const test: Test = async ({ Command, FileSystem, Git, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const workspaceDir = `${tmpDir}/workspace`

  await Workspace.setPath(tmpDir)
  const fixtureUrl = import.meta.resolve('../fixtures/git-api-discard-all-changes')
  await Command.executeExtensionCommand('git.loadFixture', fixtureUrl)
  await Workspace.setPath(workspaceDir)

  // act
  if ('discardAllChanges' in Git) {
    // @ts-ignore
    await Git.discardAllChanges()
  } else {
    await Command.execute('ExtensionHost.executeCommand', 'git.cleanAll')
  }

  // assert
  await FileSystem.shouldHaveFile(`${workspaceDir}/file.txt`, 'initial content')
  const dirents = await FileSystem.readDir(workspaceDir)
  if (dirents.some((dirent) => dirent.name === 'created.txt')) {
    throw new Error('expected created.txt to be deleted after discarding all changes')
  }
}
