export const name = 'git.commit'

export const skip = true

export const test = async ({ FileSystem, Workspace, Settings, SideBar, KeyBoard, Locator, expect }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const gitPath = await FileSystem.createExecutableFrom(`fixtures/git.commit/git.js`)
  await Settings.update({
    'git.path': gitPath,
  })
  await SideBar.open('Source Control')
  const sourceControlInput = Locator('[aria-label="Source Control Input"]')
  await sourceControlInput.focus()
  await sourceControlInput.type('test message')

  // act
  // TODO should also test loading indicator
  await KeyBoard.press('Control+Enter')
  await expect(sourceControlInput).toHaveText('')
}
