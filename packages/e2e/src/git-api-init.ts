import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.init'

export const skip = 1

export const test: Test = async ({ FileSystem, Git, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  await Workspace.setUri(tmpDir)

  // act
  await Git.init()

  // assert
  await FileSystem.shouldHaveFolder(`${tmpDir}/.git`)
  await Git.shouldHaveInvocations([
    {
      command: ['git', 'init'],
      cwd: decodeURIComponent(new URL(tmpDir).pathname).replace(/^\/(?=[A-Za-z]:)/, ''),
    },
  ])
}
