export const skip = true

export const name = 'quick-pick-select-branch'

export const test = async ({ FileSystem, Workspace, Settings, QuickPick, Locator, expect }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  await Workspace.setPath(tmpDir)
  const gitPath = await FileSystem.createExecutableFrom(``)
  await Settings.update({
    'git.path': gitPath,
  })

  // act
  await QuickPick.open()
  await QuickPick.setValue('>Git: Checkout')
  await QuickPick.selectItem('Git: Checkout')

  // assert
  // TODO verify that branch items are showing, with icon and description
}
