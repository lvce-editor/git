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

export const name = 'git.quick-pick-stash'

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

export const test: Test = async ({ Command, FileSystem, Git, QuickPick, SideBar, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const workspaceDir = `${tmpDir}/workspace`

  await Workspace.setUri(tmpDir)
  const fixtureUrl = import.meta.resolve('../fixtures/git-api-stash')
  await Command.execute('ExtensionHost.executeCommand', 'git.loadFixture', fixtureUrl)
  await Workspace.setUri(workspaceDir)
  await SideBar.open('Source Control')

  // arrange
  await Git.stash()
  await FileSystem.shouldHaveFile(`${workspaceDir}/file.txt`, 'initial content')

  await FileSystem.writeFile(`${workspaceDir}/file.txt`, 'second change')
  await Git.stash()

  // act
  await QuickPick.open()
  await QuickPick.setValue('>pop latest')
  await QuickPick.selectItem('Git: Pop Latest Stash')

  // assert
  await waitFor(() => FileSystem.shouldHaveFile(`${workspaceDir}/file.txt`, 'second change'))

  await FileSystem.writeFile(`${workspaceDir}/file.txt`, 'initial content')
  await Command.execute('ExtensionHost.executeCommand', 'git.applyStash', { stashReference: 'stash@{0}' })
  await FileSystem.shouldHaveFile(`${workspaceDir}/file.txt`, 'modified content')

  await Git.shouldHaveInvocations([
    {
      command: ['git', 'stash', 'push'],
      cwd: decodeURIComponent(new URL(workspaceDir).pathname).replace(/^\/(?=[A-Za-z]:)/, ''),
    },
    {
      command: ['git', 'stash', 'push'],
      cwd: decodeURIComponent(new URL(workspaceDir).pathname).replace(/^\/(?=[A-Za-z]:)/, ''),
    },
    {
      command: ['git', 'stash', 'pop'],
      cwd: decodeURIComponent(new URL(workspaceDir).pathname).replace(/^\/(?=[A-Za-z]:)/, ''),
    },
    {
      command: ['git', 'stash', 'apply', 'stash@{0}'],
      cwd: decodeURIComponent(new URL(workspaceDir).pathname).replace(/^\/(?=[A-Za-z]:)/, ''),
    },
  ])
}
