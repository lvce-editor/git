import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.quick-pick-add-all'

export const test: Test = async ({ expect, FileSystem, Git, Locator, QuickPick, SourceControl, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  await Workspace.setPath(tmpDir)
  await FileSystem.setFiles([
    { content: 'first file', uri: `${tmpDir}/first.txt` },
    { content: 'second file', uri: `${tmpDir}/second.txt` },
  ])
  await Git.init()
  await SourceControl.show()

  // act
  await QuickPick.open()
  await QuickPick.setValue('>Git: Add all')
  await QuickPick.selectItem('Git: Add all')

  // assert
  const treeItems = Locator('.SourceControlItems .TreeItem')
  const stagedChanges = treeItems.nth(0)
  const firstFile = treeItems.nth(1)
  const secondFile = treeItems.nth(2)
  await expect(stagedChanges).toHaveText('Staged Changes2')
  await expect(firstFile).toHaveText('first.txt')
  await expect(secondFile).toHaveText('second.txt')
  await Git.shouldHaveInvocations([
    {
      command: ['git', 'add', '.'],
      cwd: tmpDir,
    },
  ])
}
