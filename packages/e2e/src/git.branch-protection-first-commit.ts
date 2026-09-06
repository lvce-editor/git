import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.branch-protection-first-commit'

// Enable once the editor runtime includes the custom-input callback fix.
export const skip = 1

export const test: Test = async ({ Command, expect, Extension, FileSystem, Git, KeyBoard, Locator, Workspace }) => {
  await Extension.addWebExtension(import.meta.resolve('../fixtures/branch-protection-dialog'))
  const workspaceDir = await FileSystem.getTmpDir({ scheme: 'file' })
  await Workspace.setPath(workspaceDir)
  await Git.init({ initialBranch: 'main' })
  await Git.setConfig('user.name', 'Test User')
  await Git.setConfig('user.email', 'test@example.com')
  await FileSystem.writeFile(`${workspaceDir}/new-file.txt`, 'protected commit')
  await Git.stage('new-file.txt')
  await Command.execute('ExtensionHost.executeCommand', 'test.configureBranchDialog', 2)
  const committing = Command.execute('ExtensionHost.executeCommand', 'git.commit', 'Protected commit')
  const input = Locator('input[name="QuickPickInput"]')
  await expect(input).toBeVisible()
  await expect(input).toHaveValue('feature/')
  await expect(input).toBeFocused()
  await input.type('feature/protected-commit')
  await expect(input).toHaveValue('feature/protected-commit')
  await KeyBoard.press('Enter')
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
  await FileSystem.shouldHaveFile(`${workspaceDir}/.git/HEAD`, 'ref: refs/heads/feature/protected-commit\n')
  const commits1 = (await Command.execute('ExtensionHost.executeCommand', 'git.getCommits')) as readonly { readonly message: string }[]
  if (commits1[0]?.message !== 'Protected commit') {
    throw new Error(`Unexpected commits: ${JSON.stringify(commits1)}`)
  }
}
