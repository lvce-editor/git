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

export const name = 'git.quick-pick-delete-worktree'

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

  await Workspace.setUri(tmpDir)
  const fixtureUrl = import.meta.resolve('../fixtures/git-api-delete-worktree')
  await Command.execute('ExtensionHost.executeCommand', 'git.loadFixture', fixtureUrl)
  await Workspace.setUri(workspaceDir)

  // act
  await QuickPick.open()
  await QuickPick.setValue('>Git: Delete Worktree')
  await QuickPick.selectItem('Git: Delete Worktree', { waitUntil: 'quickPick' })
  const worktreeItem = Locator('#QuickPick text=feature-worktree')
  await expect(worktreeItem).toBeVisible()
  await QuickPick.selectItem('feature-worktree')

  // assert
  await waitFor(async () => {
    const worktreeEntries = await FileSystem.readDir(tmpDir)
    if (worktreeEntries.some((dirent) => dirent.name === 'feature-worktree')) {
      throw new Error('expected feature-worktree folder to be removed')
    }
  })
  await Git.shouldHaveInvocations([
    {
      command: ['git', 'worktree', 'list', '--porcelain', '-z'],
      cwd: decodeURIComponent(new URL(workspaceDir).pathname).replace(/^\/(?=[A-Za-z]:)/, ''),
    },
  ])
}
