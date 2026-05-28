import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.init'

export const test: Test = async ({ FileSystem, Git, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  await Workspace.setPath(tmpDir)

  // act
  await Git.init()

  // assert
  await FileSystem.shouldHaveFolder(`${tmpDir}/.git`)
  await Git.shouldHaveInvocations([
    {
      command: ['git', 'init'],
      cwd: tmpDir,
    },
  ])
}
