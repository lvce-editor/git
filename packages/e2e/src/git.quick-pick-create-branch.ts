import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.quick-pick-create-branch'

const waitForFileContent = async (FileSystem: { readFile: (uri: string) => Promise<string> }, uri: string, expected: string): Promise<void> => {
  for (let i = 0; i < 20; i++) {
    let actual: string
    try {
      actual = await FileSystem.readFile(uri)
    } catch {
      actual = ''
    }
    if (actual === expected) {
      return
    }
    await new Promise((resolve) => setTimeout(resolve, 100))
  }
  const actual = await FileSystem.readFile(uri)
  throw new Error(`expected ${uri} to be ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`)
}

export const test: Test = async ({ Command, expect, FileSystem, Git, Locator, QuickPick, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const workspaceDir = `${tmpDir}/workspace`
  const branchName = 'feature/new-branch'

  await Workspace.setPath(tmpDir)
  const fixtureUrl = import.meta.resolve('../fixtures/git-api-branch')
  await Command.execute('ExtensionHost.executeCommand', 'git.loadFixture', fixtureUrl)
  await Workspace.setPath(workspaceDir)

  // act
  await QuickPick.open()
  await QuickPick.setValue('>Git: Create Branch...')
  await QuickPick.selectItem('Git: Create Branch...', { waitUntil: 'quickPick' })
  const input = Locator('input[name="QuickPickInput"][placeholder="Branch name"]')
  await expect(input).toHaveAttribute('placeholder', 'Branch name')
  await expect(input).toBeFocused()
  await input.type(branchName)
  await expect(input).toHaveValue(branchName)
  await expect(input).toBeFocused()
  const quickPickItems = Locator('#QuickPick:has(input[placeholder="Branch name"]) .QuickPickItem:not(.QuickPickStatus)')
  await expect(quickPickItems).toHaveCount(0)
  await Command.execute('QuickPick.selectCurrentIndex')
  await expect(input).toBeHidden()

  // assert
  const mainRef = await FileSystem.readFile(`${workspaceDir}/.git/refs/heads/main`)
  await waitForFileContent(FileSystem, `${workspaceDir}/.git/refs/heads/${branchName}`, mainRef)
  await Git.shouldHaveInvocations([
    {
      command: ['git', 'branch', branchName],
      cwd: workspaceDir,
    },
  ])
}
