import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.gutter-decorations'

export const test: Test = async ({ Command, Editor, expect, FileSystem, Git, Locator, Main, Settings, SourceControl, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const fileName = 'file.txt'
  const fileUri = `${tmpDir}/${fileName}`
  await Workspace.setPath(tmpDir)
  await Git.init({ initialBranch: 'main' })
  await Git.setConfig('user.name', 'Test User')
  await Git.setConfig('user.email', 'test@example.com')
  await FileSystem.writeFile(fileUri, 'unchanged\nold modified\nanchor one\nwill delete\nanchor two\nlast')
  await Git.add(fileName)
  await Git.commit('Initial commit')
  await FileSystem.writeFile(fileUri, 'unchanged\nnew modified\nanchor one\nanchor two\nadded\nlast')
  await Main.openUri(fileUri)

  const gutterDecoration = Locator('.EditorGutterDecoration')
  await expect(gutterDecoration).toHaveCount(0)

  await Settings.update({ 'git.gutterDecorations': true })
  await Command.execute('Editor.handleSettingsChanged')

  const modifiedDecoration = Locator('.EditorGutterDecorationModified')
  const deletedDecoration = Locator('.EditorGutterDecorationDeleted')
  const addedDecoration = Locator('.EditorGutterDecorationAdded')
  await expect(modifiedDecoration).toHaveCount(1)
  await expect(deletedDecoration).toHaveCount(1)
  await expect(addedDecoration).toHaveCount(1)

  await Editor.setCursor(0, 9)
  await Editor.type('!')
  await expect(modifiedDecoration).toHaveCount(2)

  await Main.save()
  await Git.add(fileName)
  await SourceControl.show()
  await new Promise((resolve) => setTimeout(resolve, 1000))
  const treeItems = Locator('.SourceControlItems .TreeItem')
  await expect(treeItems).toHaveCount(2)
  const commitMessage = 'Commit gutter decoration changes'
  await SourceControl.handleInput(commitMessage)
  await SourceControl.acceptInput()
  await expect(gutterDecoration).toHaveCount(0)

  await Settings.update({ 'git.gutterDecorations': false })
  await Command.execute('Editor.handleSettingsChanged')
  await expect(gutterDecoration).toHaveCount(0)
}
