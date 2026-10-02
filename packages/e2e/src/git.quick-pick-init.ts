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

export const name = 'git.init-quick-pick'

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

export const test: Test = async ({ FileSystem, Git, QuickPick, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  await Workspace.setUri(tmpDir)

  // act
  await QuickPick.open()
  await QuickPick.setValue('>Git: Init')
  await QuickPick.selectItem('Git: Init')

  // assert
  await waitFor(() => FileSystem.shouldHaveFolder(`${tmpDir}/.git`))
  await Git.shouldHaveInvocations([
    {
      command: ['git', 'init'],
      cwd: decodeURIComponent(new URL(tmpDir).pathname).replace(/^\/(?=[A-Za-z]:)/, ''),
    },
  ])
}
