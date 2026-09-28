import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.commit-empty-dismiss'

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
  const head = await FileSystem.readFile(`${tmpDir}/.git/refs/heads/main`)
  await SourceControl.show()
  await SourceControl.handleInput('Keep this message')
  const input = Locator('[aria-label="Source Control Input"]')
  // eslint-disable-next-line e2e/no-direct-click, @typescript-eslint/no-deprecated -- Exercise the real input keyboard binding.
  await input.click()

  await KeyBoard.press('Control+Enter')

  const notification = Locator('.Notification')
  await expect(notification.locator('.NotificationOption')).toHaveText('Create Empty Commit')
  const close = notification.locator('[aria-label="Close"]')
  // eslint-disable-next-line e2e/no-direct-click, @typescript-eslint/no-deprecated -- Verify the notification close button resolves cancellation.
  await close.click()
  await expect(notification).toBeHidden()
  // A second completed source-control command waits for the cancelled acceptance to finish.
  await SourceControl.show()
  await expect(input).toHaveValue('Keep this message')
  await FileSystem.shouldHaveFile(`${tmpDir}/.git/refs/heads/main`, head)
  const commits = (await Command.execute('ExtensionHost.executeCommand', 'git.getCommits')) as readonly { readonly message: string }[]
  if (commits.length !== 1 || commits[0].message !== 'Initial commit') {
    throw new Error(`Unexpected commits: ${JSON.stringify(commits)}`)
  }
}
