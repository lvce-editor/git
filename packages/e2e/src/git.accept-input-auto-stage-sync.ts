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

export const name = 'git.accept-input-auto-stage-sync'

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
  await Command.execute('ExtensionHost.executeCommand', 'git.loadFixture', import.meta.resolve('../fixtures/git-api-push'))
  const workspaceDir = `${tmpDir}/workspace`
  await Workspace.setUri(workspaceDir)
  await Git.push({ setUpstream: ['origin', 'main'] })

  await FileSystem.setFiles([
    { content: 'modified content', uri: `${workspaceDir}/new-file.txt` },
    { content: 'untracked content', uri: `${workspaceDir}/untracked.txt` },
  ])
  await SourceControl.show()
  const sourceControl = Locator('.SourceControl')
  await expect(sourceControl).toHaveAttribute('aria-busy', 'false')
  const message = 'Ctrl+Enter auto-stage and sync'
  await SourceControl.handleInput(message)
  const input = Locator('[aria-label="Source Control Input"]')
  // eslint-disable-next-line @typescript-eslint/no-deprecated -- Focus the textarea and exercise its DOM input and keyboard binding.
  await input.type(message)
  // Wait for the input worker to process the focus event and register its shortcuts.
  await SourceControl.handleInput(message)
  await expect(input).toBeFocused()

  const previousRef = await FileSystem.readFile(`${workspaceDir}/.git/refs/heads/main`)
  const syncStatusBarItem = Locator('.StatusBarItem[name="git.sync"]')
  await KeyBoard.press('Control+Enter')

  await waitFor(async () => {
    const [localRef, remoteRef] = await Promise.all([
      FileSystem.readFile(`${workspaceDir}/.git/refs/heads/main`),
      FileSystem.readFile(`${workspaceDir}/../remote.git/refs/heads/main`),
    ])
    if (localRef === previousRef || localRef !== remoteRef) {
      throw new Error(`expected main to be synchronized, got local ${localRef} and remote ${remoteRef}`)
    }
  })
  await expect(input).toHaveValue('')
  await FileSystem.shouldHaveFile(`${workspaceDir}/new-file.txt`, 'modified content')
  await FileSystem.shouldHaveFile(`${workspaceDir}/untracked.txt`, 'untracked content')
  const commits = (await Command.execute('ExtensionHost.executeCommand', 'git.getCommits')) as readonly { readonly message: string }[]
  if (commits.length !== 2 || commits[0]?.message !== message) {
    throw new Error(`Unexpected commits: ${JSON.stringify(commits)}`)
  }
  await expect(syncStatusBarItem).toHaveText('0↓ 0↑')
  const items = Locator('.SourceControlItems .TreeItem')
  await expect(items).toHaveCount(0)
}
