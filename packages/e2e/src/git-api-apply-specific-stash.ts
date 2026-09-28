import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.apply-specific-stash'

export const test: Test = async ({ Command, FileSystem, Git, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const workspaceDir = `${tmpDir}/workspace`
  await Workspace.setUri(tmpDir)
  await Command.execute('ExtensionHost.executeCommand', 'git.loadFixture', import.meta.resolve('../fixtures/git-api-stash'))
  await Workspace.setUri(workspaceDir)
  await Git.stash('first')
  await FileSystem.writeFile(`${workspaceDir}/file.txt`, 'second change')
  await Git.stash('second')

  await Command.execute('ExtensionHost.executeCommand', 'git.applyStash', { stashReference: 'stash@{1}' })

  await FileSystem.shouldHaveFile(`${workspaceDir}/file.txt`, 'modified content')
}
