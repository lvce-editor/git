import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.gutter-decorations'

// Enable after @lvce-editor/api and editor-worker support are released into the test server.
export const skip = 1

export const test: Test = async ({ Command, expect, FileSystem, Git, Locator, Main, Settings, Workspace }) => {
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
}
