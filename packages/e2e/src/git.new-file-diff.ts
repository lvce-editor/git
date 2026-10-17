import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.new-file-diff'

export const test: Test = async ({ Command, expect, FileSystem, Locator, SideBar, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const workspaceDir = `${tmpDir}/workspace`
  const fileName = 'new-file.txt'

  await Workspace.setUri(tmpDir)
  await Command.execute('ExtensionHost.executeCommand', 'git.loadFixture', import.meta.resolve('../fixtures/git-api-branch'))
  await Workspace.setUri(workspaceDir)
  await FileSystem.writeFile(`${workspaceDir}/${fileName}`, 'new file contents')
  await SideBar.open('Source Control')

  const file = Locator('.SourceControlItems .TreeItem').nth(1)
  await expect(file).toHaveText(fileName)
  // eslint-disable-next-line e2e/no-direct-click, @typescript-eslint/no-deprecated -- Verify opening a new file diff through the real Source Control row click.
  await file.click()

  const diffEditor = Locator('.DiffEditor')
  const changedContent = Locator('.DiffEditor .DiffEditorRows')
  const errorMessage = Locator('.DiffEditorErrorMessage')
  await expect(diffEditor).toBeVisible()
  await expect(changedContent).toContainText('new file contents')
  await expect(errorMessage).toHaveCount(0)
}
