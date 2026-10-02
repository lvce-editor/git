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

export const name = 'git.branch-picker-duplicate-name'

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

export const test: Test = async ({ Command, Dialog, expect, FileSystem, Locator, QuickPick, SideBar, Workspace }) => {
  await Dialog.mockConfirm(() => true)
  // arrange
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const workspaceDir = `${tmpDir}/workspace`
  await Workspace.setUri(tmpDir)
  const fixtureUrl = import.meta.resolve('../fixtures/git-api-checkout')
  await Command.execute('ExtensionHost.executeCommand', 'git.loadFixture', fixtureUrl)
  await Workspace.setUri(workspaceDir)
  await SideBar.open('Source Control')

  // act
  const branchPickerPromise = Command.execute('StatusBar.handleClick', 'git.showBranchPicker')
  const createBranchItem = Locator('#QuickPick .QuickPickItem').nth(0)
  await waitFor(() => expect(createBranchItem).toContainText('Create new branch...'))
  await QuickPick.selectItem('Create new branch...', { waitUntil: 'none' })
  const input = Locator('input[name="QuickPickInput"][placeholder="Branch name"]')
  await waitFor(() => expect(input).toBeFocused())
  await QuickPick.setValue('main')
  await Command.execute('QuickPick.selectCurrentIndex')
  await expect(input).toHaveValue('')
  await expect(input).toBeFocused()
  await FileSystem.shouldHaveFile(`${workspaceDir}/.git/HEAD`, 'ref: refs/heads/main\n')
  const branchName = 'new/from-picker'
  await QuickPick.setValue(branchName)
  await Command.execute('QuickPick.selectCurrentIndex')
  await branchPickerPromise

  // assert
  const mainRef = await FileSystem.readFile(`${workspaceDir}/.git/refs/heads/main`)
  await FileSystem.shouldHaveFile(`${workspaceDir}/.git/refs/heads/${branchName}`, mainRef)
  await FileSystem.shouldHaveFile(`${workspaceDir}/.git/HEAD`, `ref: refs/heads/${branchName}\n`)
  const branchStatusBarItem = Locator('.StatusBarItem[data-name="git.showBranchPicker"], .StatusBarItem[name="git.showBranchPicker"]')
  await expect(branchStatusBarItem).toHaveText(branchName)
}
