import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.init'

// @ts-ignore
export const test: Test = async ({ Command, expect, FileSystem, Git, KeyBoard, Locator, Settings, SideBar, SourceControl, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  await Workspace.setPath(tmpDir)

  // act
  await Git.init()

  // assert
  // @ts-ignore
  await FileSystem.shouldHaveFolder(`${tmpDir}/.git`)
  await Git.shouldHaveInvocations([
    {
      command: ['git', 'init'],
      cwd: tmpDir,
    },
  ])
}
