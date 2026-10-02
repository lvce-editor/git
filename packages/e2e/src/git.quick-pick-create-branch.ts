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

export const name = 'git.quick-pick-create-branch'

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

export const test: Test = async ({ Command, expect, FileSystem, Git, Locator, QuickPick, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const workspaceDir = `${tmpDir}/workspace`
  const branchName = 'feature/new-branch'

  await Workspace.setUri(tmpDir)
  const fixtureUrl = import.meta.resolve('../fixtures/git-api-branch')
  await Command.execute('ExtensionHost.executeCommand', 'git.loadFixture', fixtureUrl)
  await Workspace.setUri(workspaceDir)

  // act
  await QuickPick.open()
  await QuickPick.setValue('>Git: Create Branch...')
  await QuickPick.selectItem('Git: Create Branch...', { waitUntil: 'none' })
  const input = Locator('input[name="QuickPickInput"][placeholder="Branch name"]')
  await expect(input).toBeVisible()
  await expect(input).toBeFocused()
  await QuickPick.setValue(branchName)
  await expect(input).toHaveValue(branchName)
  await expect(input).toBeFocused()
  const quickPickItems = Locator('#QuickPick:has(input[placeholder="Branch name"]) .QuickPickItem:not(.QuickPickStatus)')
  await expect(quickPickItems).toHaveCount(0)
  await Command.execute('QuickPick.selectCurrentIndex')
  await expect(input).toBeHidden()

  // assert
  const mainRef = await FileSystem.readFile(`${workspaceDir}/.git/refs/heads/main`)
  await waitFor(async () => {
    const branchRef = await FileSystem.readFile(`${workspaceDir}/.git/refs/heads/${branchName}`)
    if (branchRef !== mainRef) {
      throw new Error(`Expected ${branchName} to point to ${mainRef}, got ${branchRef}`)
    }
  })
  await Git.shouldHaveInvocations([
    {
      command: ['git', 'branch', branchName],
      cwd: decodeURIComponent(new URL(workspaceDir).pathname).replace(/^\/(?=[A-Za-z]:)/, ''),
    },
  ])
}
