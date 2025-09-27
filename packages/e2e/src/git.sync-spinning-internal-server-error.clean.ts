import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.sync-spinning-internal-server-error.clean'

export const skip = 1

export const test: Test = async ({ FileSystem, QuickPick, Workspace, Settings, Locator, expect }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/test.txt`, 'div')
  await Settings.update({
    'git.path': 'git',
  })

  // act
  await QuickPick.executeCommand('Git: Sync')

  // assert
  const dialogErrorMessage = Locator('#DialogBodyErrorMessage')
  await expect(dialogErrorMessage).toBeVisible()
  await expect(dialogErrorMessage).toHaveText('Error: Git: remote: Internal Server Error')
}
