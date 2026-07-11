import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.clone'

// export const skip = 1

export const test: Test = async ({ Command, FileSystem, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const cloneDir = `${tmpDir}/clone`

  await Workspace.setPath(tmpDir)
  const setupFixtureUrl = import.meta.resolve('../fixtures/git-api-clone')
  await Command.execute('ExtensionHost.executeCommand', 'git.loadFixture', setupFixtureUrl)

  // act
  const cloneFixtureUrl = import.meta.resolve('../fixtures/git-api-clone-act')
  await Command.execute('ExtensionHost.executeCommand', 'git.loadFixture', cloneFixtureUrl)

  // assert
  await FileSystem.shouldHaveFile(`${cloneDir}/.git/HEAD`, 'ref: refs/heads/main\n')
  await FileSystem.shouldHaveFile(`${cloneDir}/file.txt`, 'cloned from disk')
}
