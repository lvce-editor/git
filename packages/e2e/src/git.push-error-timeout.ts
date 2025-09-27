import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.push-error-timeout'

export const skip = true

export const test: Test = async ({ FileSystem, Workspace, Settings, QuickPick, Locator, expect }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  await Workspace.setPath(tmpDir)
  const gitPath = await FileSystem.createExecutableFrom(`fixtures/git.push-error-timeout/git.js`)
  await Settings.update({
    'git.path': gitPath,
  })

  // act
  await QuickPick.executeCommand('Git: Push')

  // assert
  // TODO after a fixed amount of time, should show a message that command is running too long
  // with a cancel button

  // TODO background operations like git fetch in the background should not show timeout error when they fail
  const dialogErrorMessage = Locator('#DialogBodyErrorMessage')
  await expect(dialogErrorMessage).toBeVisible()
  // TODO error message could be improved, maybe something like Git operations was canceled after 3 seconds
  await expect(dialogErrorMessage).toHaveText('Error: Git push timeout out after 3000ms')
}

