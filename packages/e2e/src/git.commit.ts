import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.commit'

export const skip = true

export const test: Test = async ({ expect, FileSystem, KeyBoard, Locator, Settings, SideBar, SourceControl, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const gitPath = await FileSystem.createExecutableFrom(`fixtures/git.commit/git.js`)
  await Settings.update({
    'git.path': gitPath,
  })
  await SideBar.open('Source Control')
  await SourceControl.handleInput('test message')

  // act
  // TODO should also test loading indicator
  // TODO call source control accept
  // await KeyBoard.press('Control+Enter')
  // await expect(sourceControlInput).toHaveText('')
}
