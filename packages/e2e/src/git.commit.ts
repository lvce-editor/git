import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.commit'

export const test: Test = async ({ expect, FileSystem, Git, Locator, SourceControl, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  await Workspace.setPath(tmpDir)
  await Git.init()
  await Git.setConfig('user.name', 'Test User')
  await Git.setConfig('user.email', 'test@example.com')
  await FileSystem.writeFile(`${tmpDir}/file.txt`, 'content')
  await SourceControl.show()
  await new Promise((resolve) => setTimeout(resolve, 1000))
  const treeItems = Locator('.SourceControlItems .TreeItem')
  await expect(treeItems).toHaveCount(2)
  await SourceControl.handleInput('test message')

  // act
  await SourceControl.acceptInput()

  // assert
  await Git.shouldHaveInvocations([
    {
      command: ['git', 'commit', '-m', 'test message'],
      cwd: tmpDir,
    },
  ])
  await expect(treeItems).toHaveCount(0)
}
