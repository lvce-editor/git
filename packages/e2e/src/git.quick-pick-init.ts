import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.init-quick-pick'

export const test: Test = async ({ FileSystem, Git, QuickPick, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  await Workspace.setUri(tmpDir)

  // act
  await QuickPick.open()
  await QuickPick.setValue('>Git: Init')
  await QuickPick.selectItem('Git: Init')
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // assert
  await FileSystem.shouldHaveFolder(`${tmpDir}/.git`)
  await Git.shouldHaveInvocations([
    {
      command: ['git', 'init'],
      cwd: decodeURIComponent(new URL(tmpDir).pathname).replace(/^\/(?=[A-Za-z]:)/, ''),
    },
  ])
}
