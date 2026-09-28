import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.stash-deletion'

export const test: Test = async ({ Command, FileSystem, Git, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const workspaceDir = `${tmpDir}/workspace`
  await Workspace.setUri(tmpDir)
  await Command.execute('ExtensionHost.executeCommand', 'git.loadFixture', import.meta.resolve('../fixtures/git-api-deleted-file'))
  await Workspace.setUri(workspaceDir)

  await Git.stash()

  await FileSystem.shouldHaveFile(`${workspaceDir}/deleted.txt`, 'tracked content')
}
