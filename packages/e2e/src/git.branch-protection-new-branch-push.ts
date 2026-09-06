import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.branch-protection-new-branch-push'

// Enable once the editor runtime includes the custom-input callback fix.
export const skip = 1

export const test: Test = async ({ Command, expect, Extension, FileSystem, Git, KeyBoard, Locator, SourceControl, Workspace }) => {
  await Extension.addWebExtension(import.meta.resolve('../fixtures/branch-protection-dialog'))
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  await Workspace.setPath(tmpDir)
  await Command.execute('ExtensionHost.executeCommand', 'git.loadFixture', import.meta.resolve('../fixtures/git-api-push'))
  const workspaceDir = `${tmpDir}/workspace`
  await Workspace.setPath(workspaceDir)
  await FileSystem.writeFile(`${workspaceDir}/new-file.txt`, 'protected commit')
  await Git.stage('new-file.txt')
  const mainRef = await FileSystem.readFile(`${workspaceDir}/.git/refs/heads/main`)
  await SourceControl.show()
  const treeItems = Locator('.SourceControlItems .TreeItem')
  await expect(treeItems).toHaveCount(2)
  await SourceControl.handleInput('Protected commit')
  await Command.execute('ExtensionHost.executeCommand', 'test.configureBranchDialog', 2)
  const committing = SourceControl.acceptInput()
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
  await FileSystem.shouldHaveFile(`${workspaceDir}/.git/refs/heads/main`, mainRef)
  const branchRef = await FileSystem.readFile(`${workspaceDir}/.git/refs/heads/feature/protected-commit`)
  await FileSystem.shouldHaveFile(`${workspaceDir}/../remote.git/refs/heads/feature/protected-commit`, branchRef)
  const config = await FileSystem.readFile(`${workspaceDir}/.git/config`)
  if (!config.includes('[branch "feature/protected-commit"]') || !config.includes('merge = refs/heads/feature/protected-commit')) {
    throw new Error(`Expected the new branch to track its remote: ${config}`)
  }
}
