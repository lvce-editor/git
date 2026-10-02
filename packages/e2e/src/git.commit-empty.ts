import type { Test } from '@lvce-editor/test-with-playwright'

const yieldToEventLoop = (): Promise<void> =>
  new Promise((resolve) => {
    const channel = new MessageChannel()
    channel.port1.onmessage = (): void => {
      channel.port1.close()
      channel.port2.close()
      resolve()
    }
    channel.port2.postMessage(null)
  })

export const name = 'git.commit-empty'

const waitFor = async (condition: () => Promise<void>): Promise<void> => {
  let lastError: unknown
  for (let attempt = 0; attempt < 500; attempt++) {
    try {
      await condition()
      return
    } catch (error) {
      lastError = error
      await yieldToEventLoop()
    }
  }
  throw lastError
}

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
  const sourceControl = Locator('.SourceControl')
  await expect(sourceControl).toHaveAttribute('aria-busy', 'false')
  await SourceControl.handleInput('My empty commit')
  const input = Locator('[aria-label="Source Control Input"]')
  // eslint-disable-next-line @typescript-eslint/no-deprecated -- Focus the textarea and exercise its DOM input and keyboard binding.
  await input.type('My empty commit')
  // Wait for the input worker to process the focus event and register its shortcuts.
  await SourceControl.handleInput('My empty commit')
  await expect(input).toBeFocused()

  await KeyBoard.press('Control+Enter')

  const notification = Locator('.Notification')
  const notificationMessage = notification.locator('.NotificationMessage')
  await waitFor(() => expect(notificationMessage).toHaveText('There are no changes to commit'))
  await expect(input).toHaveValue('My empty commit')
  const option = notification.locator('.NotificationOption')
  // eslint-disable-next-line e2e/no-direct-click, @typescript-eslint/no-deprecated -- Verify the notification DOM action resolves the pending request.
  await option.click()
  await expect(notification).toBeHidden()
  await waitFor(async () => {
    const commits = (await Command.execute('ExtensionHost.executeCommand', 'git.getCommits')) as readonly { readonly message: string }[]
    if (commits.length < 2) {
      throw new Error(`Expected both empty and initial commits, got ${JSON.stringify(commits)}`)
    }
  })
  const commits = (await Command.execute('ExtensionHost.executeCommand', 'git.getCommits')) as readonly { readonly message: string }[]
  if (commits.length !== 2 || commits[0].message !== 'My empty commit' || commits[1].message !== 'Initial commit') {
    throw new Error(`Unexpected commits: ${JSON.stringify(commits)}`)
  }
  await expect(input).toHaveValue('')
  await FileSystem.shouldHaveFile(`${tmpDir}/file.txt`, 'content')
  const items = Locator('.SourceControlItems .TreeItem')
  await expect(items).toHaveCount(0)
}
