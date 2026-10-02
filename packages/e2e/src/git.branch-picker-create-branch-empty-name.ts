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

export const name = 'git.branch-picker-create-branch-empty-name'

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
  await Workspace.setUri(tmpDir)
  const fixtureUrl = import.meta.resolve('../fixtures/git-api-checkout')
  await Command.execute('ExtensionHost.executeCommand', 'git.loadFixture', fixtureUrl)
  await Workspace.setUri(workspaceDir)
  await SideBar.open('Source Control')
  const branchStatusBarItem = Locator('.StatusBarItem[data-name="git.showBranchPicker"], .StatusBarItem[name="git.showBranchPicker"]')
  await expect(branchStatusBarItem).toHaveText('main')

  // act
  const branchPickerPromise = Command.execute('StatusBar.handleClick', 'git.showBranchPicker')
  const createBranchItem = Locator('#QuickPick .QuickPickItem').nth(0)
  await waitFor(() => expect(createBranchItem).toContainText('Create new branch...'))
  await QuickPick.selectItem('Create new branch...', { waitUntil: 'none' })
  const input = Locator('input[name="QuickPickInput"][placeholder="Branch name"]')
  await waitFor(() => expect(input).toBeFocused())
  await Command.execute('QuickPick.selectCurrentIndex')
  await branchPickerPromise

  // assert
  const branchRefs = await FileSystem.readDir(`${workspaceDir}/.git/refs/heads`)
  if (branchRefs.some((entry) => entry.name !== 'feature' && entry.name !== 'main')) {
    throw new Error('expected empty branch name not to create a branch')
  }
  await FileSystem.shouldHaveFile(`${workspaceDir}/.git/HEAD`, 'ref: refs/heads/main\n')
  await expect(branchStatusBarItem).toHaveText('main')
}
