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

export const name = 'git.branch-picker-create-branch-from'

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

export const test: Test = async ({ Command, expect, FileSystem, Locator, QuickPick, SideBar, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const workspaceDir = `${tmpDir}/workspace`
  const branchName = 'new/from-existing'
  await Workspace.setUri(tmpDir)
  const fixtureUrl = import.meta.resolve('../fixtures/git-api-checkout')
  await Command.execute('ExtensionHost.executeCommand', 'git.loadFixture', fixtureUrl)
  await Workspace.setUri(workspaceDir)
  await SideBar.open('Source Control')
  const branchStatusBarItem = Locator('.StatusBarItem[data-name="git.showBranchPicker"], .StatusBarItem[name="git.showBranchPicker"]')
  await expect(branchStatusBarItem).toHaveText('main')

  // act
  const branchPickerPromise = Command.execute('StatusBar.handleClick', 'git.showBranchPicker')
  const createBranchFromItem = Locator('#QuickPick .QuickPickItem').nth(1)
  await waitFor(() => expect(createBranchFromItem).toContainText('Create new branch from...'))
  await QuickPick.selectItem('Create new branch from...', { waitUntil: 'none' })
  const input = Locator('input[name="QuickPickInput"][placeholder="Branch name"]')
  await waitFor(() => expect(input).toBeVisible())
  await QuickPick.setValue(branchName)
  await Command.execute('QuickPick.selectCurrentIndex')
  const featureItem = Locator('#QuickPick .QuickPickItem').nth(0)
  await waitFor(() => expect(featureItem).toBeVisible())
  await QuickPick.selectItem('feature')
  await branchPickerPromise

  // assert
  const featureRef = await FileSystem.readFile(`${workspaceDir}/.git/refs/heads/feature`)
  await FileSystem.shouldHaveFile(`${workspaceDir}/.git/refs/heads/${branchName}`, featureRef)
  await FileSystem.shouldHaveFile(`${workspaceDir}/.git/HEAD`, `ref: refs/heads/${branchName}\n`)
  await FileSystem.shouldHaveFile(`${workspaceDir}/file.txt`, 'feature branch')
  await expect(branchStatusBarItem).toHaveText(branchName)
}
