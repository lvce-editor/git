import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.branch-protection-input-cancel'

// Enable once the editor runtime includes the custom-input callback fix.
export const skip = 1

export const test: Test = async ({ Command, expect, Extension, FileSystem, Git, KeyBoard, Locator, Settings, Workspace }) => {
  await Extension.addWebExtension(import.meta.resolve('../fixtures/branch-protection-dialog'))
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  await Workspace.setPath(tmpDir)
  await Command.execute('ExtensionHost.executeCommand', 'git.loadFixture', import.meta.resolve('../fixtures/git-api-push'))
  const workspaceDir = `${tmpDir}/workspace`
  await Workspace.setPath(workspaceDir)
  await FileSystem.writeFile(`${workspaceDir}/new-file.txt`, 'protected commit')
  await Git.stage('new-file.txt')
  await Command.execute('ExtensionHost.executeCommand', 'test.configureBranchDialog', 2)
  const mainRef = await FileSystem.readFile(`${workspaceDir}/.git/refs/heads/main`)
  const committing = Command.execute('ExtensionHost.executeCommand', 'git.commitAndSync', 'Protected commit')
  const input = Locator('input[name="QuickPickInput"]')
  await expect(input).toBeVisible()
  await expect(input).toHaveValue('feature/')
  await expect(input).toBeFocused()
  await KeyBoard.press('Escape')
  await expect(input).toBeHidden()
  await committing
  const options = await Command.execute('ExtensionHost.executeCommand', 'test.getBranchDialogOptions')
  const expected = {
    buttons: ['Commit Anyway', 'Cancel', 'Commit to a New Branch'],
    defaultId: 2,
    message: 'You are trying to commit to a protected branch. How would you like to proceed?',
    type: 'warning',
  }
  if (JSON.stringify(options) !== JSON.stringify(expected)) {
    throw new Error(`Unexpected branch protection dialog: ${JSON.stringify(options)}`)
  }
  await FileSystem.shouldHaveFile(`${workspaceDir}/.git/HEAD`, 'ref: refs/heads/main\n')
  const commits1 = (await Command.execute('ExtensionHost.executeCommand', 'git.getCommits')) as readonly { readonly message: string }[]
  if (commits1[0]?.message !== 'Initial commit') {
    throw new Error(`Unexpected commits: ${JSON.stringify(commits1)}`)
  }
  await FileSystem.shouldHaveFile(`${workspaceDir}/.git/refs/heads/main`, mainRef)
  await FileSystem.shouldHaveFile(`${workspaceDir}/new-file.txt`, 'protected commit')
  // The staged change is still available after cancellation.
  await Settings.update({ 'git.branchProtection': false })
  await Command.execute('ExtensionHost.executeCommand', 'git.commitStaged', 'After cancellation')
  await FileSystem.shouldHaveFile(`${workspaceDir}/.git/HEAD`, 'ref: refs/heads/main\n')
  const commits2 = (await Command.execute('ExtensionHost.executeCommand', 'git.getCommits')) as readonly { readonly message: string }[]
  if (commits2[0]?.message !== 'After cancellation') {
    throw new Error(`Unexpected commits: ${JSON.stringify(commits2)}`)
  }
}
