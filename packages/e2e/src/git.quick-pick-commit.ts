import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.quick-pick-commit'

export const test: Test = async ({ Command, expect, FileSystem, Git, KeyBoard, Locator, QuickPick, SideBar, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  await Workspace.setUri(tmpDir)
  await Command.execute('ExtensionHost.executeCommand', 'git.loadFixture', import.meta.resolve('../fixtures/git-api-checkout'))
  const workspaceDir = `${tmpDir}/workspace`
  await Workspace.setUri(workspaceDir)
  await Git.checkout('feature')
  await FileSystem.writeFile(`${workspaceDir}/file.txt`, 'another change')
  await Git.stage('file.txt')
  await SideBar.open('Source Control')
  const treeItems = Locator('.SourceControlItems .TreeItem')
  await expect(treeItems).toHaveCount(2)
  const originalRef = await FileSystem.readFile(`${workspaceDir}/.git/refs/heads/feature`)

  await QuickPick.open()
  await QuickPick.setValue('>Git: Commit')
  await QuickPick.selectItem('Git: Commit', { waitUntil: 'none' })
  const input = Locator('input[name="QuickPickInput"][placeholder="Commit message"]')
  await expect(input).toBeVisible()
  await expect(input).toBeFocused()
  await KeyBoard.press('Escape')
  await expect(input).toBeHidden()
  await FileSystem.shouldHaveFile(`${workspaceDir}/.git/refs/heads/feature`, originalRef)
  await expect(treeItems).toHaveCount(2)

  await QuickPick.open()
  await QuickPick.setValue('>Git: Commit')
  await QuickPick.selectItem('Git: Commit', { waitUntil: 'none' })
  await expect(input).toBeVisible()
  await QuickPick.setValue('Second feature commit')
  await KeyBoard.press('Enter')
  await expect(input).toBeHidden()
  await expect(treeItems).toHaveCount(0)
  const commits = (await Command.execute('ExtensionHost.executeCommand', 'git.getCommits')) as readonly { readonly message: string }[]
  if (commits[0]?.message !== 'Second feature commit') {
    throw new Error(`Expected Second feature commit, got ${JSON.stringify(commits)}`)
  }
}
