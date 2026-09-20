import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.quick-pick-merge'

const waitForFileContent = async (FileSystem: { readFile: (uri: string) => Promise<string> }, uri: string, expected: string): Promise<void> => {
  for (let i = 0; i < 20; i++) {
    let actual: string | undefined
    try {
      actual = await FileSystem.readFile(uri)
    } catch {
      actual = undefined
    }
    if (actual === expected) {
      return
    }
    await new Promise((resolve) => setTimeout(resolve, 100))
  }
  const actual = await FileSystem.readFile(uri)
  throw new Error(`expected ${uri} to be ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`)
}

export const test: Test = async ({ Command, expect, FileSystem, Git, Locator, QuickPick, SideBar, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const workspaceDir = `${tmpDir}/workspace`

  await Workspace.setPath(tmpDir)
  const fixtureUrl = import.meta.resolve('../fixtures/git-api-merge')
  await Command.execute('ExtensionHost.executeCommand', 'git.loadFixture', fixtureUrl)
  await Workspace.setPath(workspaceDir)
  await SideBar.open('Source Control')

  // act
  await QuickPick.open()
  await QuickPick.setValue('>Git: Merge')
  await QuickPick.selectItem('Git: Merge', { waitUntil: 'none' })
  const branchItem = Locator('#QuickPick').locator('text=feature')
  await expect(branchItem).toBeVisible()
  await QuickPick.selectItem('feature')

  // assert
  await waitForFileContent(FileSystem, `${workspaceDir}/added.txt`, 'merged content')
  await waitForFileContent(FileSystem, `${workspaceDir}/.git/HEAD`, 'ref: refs/heads/main\n')
  await Git.shouldHaveInvocations([
    {
      command: ['git', 'merge', 'feature'],
      cwd: workspaceDir,
    },
  ])
}
