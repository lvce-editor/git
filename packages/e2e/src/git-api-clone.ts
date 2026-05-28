import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.clone'

// export const skip = 1

export const test: Test = async ({ Command, FileSystem, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  const cloneDir = `${tmpDir}/clone`

  await Workspace.setPath(tmpDir)
  const setupFixtureUrl = import.meta.resolve('../fixtures/git-api-clone')
  await Command.execute('ExtensionHost.executeCommand', 'git.loadFixture', setupFixtureUrl)

  // act
  const cloneFixtureUrl = import.meta.resolve('../fixtures/git-api-clone-act')
  await Command.execute('ExtensionHost.executeCommand', 'git.loadFixture', cloneFixtureUrl)

  // assert
  const headContent = await FileSystem.readFile(`${cloneDir}/.git/HEAD`)
  if (headContent !== 'ref: refs/heads/main\n') {
    throw new Error(`expected HEAD to point to main, got ${headContent}`)
  }
  const fileContent = await FileSystem.readFile(`${cloneDir}/file.txt`)
  if (fileContent !== 'cloned from disk') {
    throw new Error(`expected cloned content, got ${fileContent}`)
  }
}
