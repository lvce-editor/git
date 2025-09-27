import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.commit-error-empty-message'

export const skip = true

export const test: Test = async ({ FileSystem, Workspace, Settings, SideBar, KeyBoard, Locator, expect }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  await Workspace.setPath(tmpDir)
  const gitPath = await FileSystem.createExecutableFrom(`fixtures/git.commit-error-empty-message/git.js`)
  await Settings.update({
    'git.path': gitPath,
  })
  await SideBar.open('Source Control')
  const sourceControlInput = Locator('[aria-label="Source Control Input"]')
  await sourceControlInput.focus()

  // act
  await KeyBoard.press('Control+Enter')

  // assert
  const notification = Locator('.Notification')
  await expect(notification).toBeVisible()
  await expect(notification).toHaveCount(1)
  const notificationMessage = notification.locator('.NotificationMessage')
  await expect(notificationMessage).toHaveText('There are no changes to commit')
  const notificationOption = notification.locator('.NotificationOption')
  await expect(notificationOption).toHaveText('Create Empty Commit')
}
