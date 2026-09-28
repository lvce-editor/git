import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.commit-empty'

// Enable after the server includes Notification.showWithOptions and provider cancellation.
export const skip = 1

export const test: Test = async ({ Command, expect, FileSystem, Git, KeyBoard, Locator, Settings, SourceControl, Workspace }) => {
  await Settings.update({ 'git.branchProtection': false })
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  await Workspace.setUri(tmpDir)
  await Git.init({ initialBranch: 'main' })
  await Git.setConfig('user.name', 'Test User')
  await Git.setConfig('user.email', 'test@example.com')
  await FileSystem.writeFile(`${tmpDir}/file.txt`, 'content')
  await Command.execute('ExtensionHost.executeCommand', 'git.acceptInput', 'Initial commit')
  await SourceControl.show()
  await SourceControl.handleInput('My empty commit')
  const input = Locator('[aria-label="Source Control Input"]')
  // eslint-disable-next-line e2e/no-direct-click, @typescript-eslint/no-deprecated -- Exercise the real input keyboard binding.
  await input.click()

  await KeyBoard.press('Control+Enter')

  const notification = Locator('.Notification')
  await expect(notification.locator('.NotificationMessage')).toHaveText('There are no changes to commit')
  await expect(input).toHaveValue('My empty commit')
  const option = notification.locator('.NotificationOption')
  // eslint-disable-next-line e2e/no-direct-click, @typescript-eslint/no-deprecated -- Verify the notification DOM action resolves the pending request.
  await option.click()
  await expect(notification).toBeHidden()
  await expect(input).toHaveValue('')
  const commits = (await Command.execute('ExtensionHost.executeCommand', 'git.getCommits')) as readonly { readonly message: string }[]
  if (commits.length !== 2 || commits[0].message !== 'My empty commit' || commits[1].message !== 'Initial commit') {
    throw new Error(`Unexpected commits: ${JSON.stringify(commits)}`)
  }
  await FileSystem.shouldHaveFile(`${tmpDir}/file.txt`, 'content')
  const items = Locator('.SourceControlItems .TreeItem')
  await expect(items).toHaveCount(0)
}
