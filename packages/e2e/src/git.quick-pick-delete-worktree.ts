import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.quick-pick-delete-worktree'

const waitForFolderRemoval = async (
  FileSystem: { readDir: (uri: string) => Promise<readonly { readonly name: string }[]> },
  parentDir: string,
  folderName: string,
): Promise<void> => {
  for (let i = 0; i < 20; i++) {
    const entries = await FileSystem.readDir(parentDir)
    if (entries.every((dirent) => dirent.name !== folderName)) {
      return
    }
    await new Promise((resolve) => setTimeout(resolve, 100))
  }
  throw new Error(`expected ${folderName} folder to be removed`)
}

export const test: Test = async ({ Command, expect, FileSystem, Git, Locator, QuickPick, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const workspaceDir = `${tmpDir}/workspace`
  const worktreeDir = `${tmpDir}/feature-worktree`

  await Workspace.setPath(tmpDir)
  const fixtureUrl = import.meta.resolve('../fixtures/git-api-delete-worktree')
  await Command.execute('ExtensionHost.executeCommand', 'git.loadFixture', fixtureUrl)
  await Workspace.setPath(workspaceDir)

  // act
  await QuickPick.open()
  await QuickPick.setValue('>Git: Delete Worktree')
  await QuickPick.selectItem('Git: Delete Worktree', { waitUntil: 'quickPick' })
  const quickPick = Locator('#QuickPick')
  await expect(quickPick).toBeVisible()
  await expect(quickPick.locator('text=feature-worktree')).toBeVisible()
  await QuickPick.selectItem('feature-worktree')

  // assert
  await waitForFolderRemoval(FileSystem, tmpDir, 'feature-worktree')
  await Git.shouldHaveInvocations([
    {
      command: ['git', 'worktree', 'list', '--porcelain', '-z'],
      cwd: workspaceDir,
    },
    {
      command: ['git', 'worktree', 'remove', worktreeDir],
      cwd: workspaceDir,
    },
  ])
}
