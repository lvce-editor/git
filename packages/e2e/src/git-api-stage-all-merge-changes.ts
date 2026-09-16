import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.stage-all-merge-changes'

export const test: Test = async ({ expect, FileSystem, Git, Locator, Settings, SourceControl, Workspace }) => {
  await Settings.update({ 'git.branchProtection': false })
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const files = ['conflict one.txt', 'conflict two.txt']
  await Workspace.setPath(tmpDir)
  await Git.init({ initialBranch: 'main' })
  await Git.setConfig('user.name', 'Test User')
  await Git.setConfig('user.email', 'test@example.com')
  await FileSystem.setFiles(
    files.map((fileName) => ({
      content: 'base\n',
      uri: `${tmpDir}/${fileName}`,
    })),
  )
  await Git.addAll()
  await Git.commit('base')
  await Git.branch('feature')
  await Git.checkout('feature')
  for (const fileName of files) {
    await FileSystem.writeFile(`${tmpDir}/${fileName}`, 'feature\n')
  }
  await Git.addAll()
  await Git.commit('feature changes')
  await Git.checkout('main')
  for (const fileName of files) {
    await FileSystem.writeFile(`${tmpDir}/${fileName}`, 'main\n')
  }
  await Git.addAll()
  await Git.commit('main changes')

  let mergeFailed = false
  try {
    await Git.merge('feature')
  } catch {
    mergeFailed = true
  }
  if (!mergeFailed) {
    throw new Error('expected merge to fail with conflicts')
  }

  await FileSystem.setFiles([
    { content: 'unrelated\n', uri: `${tmpDir}/unrelated.txt` },
    { content: 'staged\n', uri: `${tmpDir}/already staged.txt` },
  ])
  await Git.stage('already staged.txt')
  await SourceControl.show()

  const treeItems = Locator('.SourceControlItems .TreeItem')
  const mergeGroup = treeItems.nth(0)
  const mergeStageAllButton = mergeGroup.locator('.SourceControlButton[aria-label="Stage All Merge Changes"][title="Stage All Merge Changes"]')
  await expect(mergeStageAllButton).toHaveCount(1)
  await expect(mergeGroup).toHaveText('Merge Changes2')

  await SourceControl.handleClickSourceControlButtons(0, 'Stage All Merge Changes')

  const stagedGroup = treeItems.nth(0)
  const changesGroup = treeItems.nth(4)
  await expect(stagedGroup).toHaveText('Staged Changes3')
  await expect(changesGroup).toHaveText('Changes1')
  const unrelatedFile = treeItems.nth(5)
  await expect(unrelatedFile).toHaveText('unrelated.txt')
}
