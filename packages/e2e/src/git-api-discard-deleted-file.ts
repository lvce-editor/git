import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.discard-deleted-file'

export const test: Test = async ({ Command, FileSystem, Settings, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const workspaceDir = `${tmpDir}/workspace`

  await Workspace.setPath(tmpDir)
  const fixtureUrl = import.meta.resolve('../fixtures/git-api-deleted-file')
  await Command.execute('ExtensionHost.executeCommand', 'git.loadFixture', fixtureUrl)
  await Workspace.setPath(workspaceDir)
  await Settings.update({
    'git.confirmDiscard': false,
  })

  await Command.execute('ExtensionHost.executeCommand', 'git.discard', 'deleted.txt')

  await FileSystem.shouldHaveFile(`${workspaceDir}/deleted.txt`, 'tracked content')
}
