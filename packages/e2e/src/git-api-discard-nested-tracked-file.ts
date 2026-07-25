import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.discard-nested-tracked-file'

export const test: Test = async ({ Command, FileSystem, Settings, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const workspaceDir = `${tmpDir}/workspace`
  const fileName = 'nested/file.txt'

  await Workspace.setPath(tmpDir)
  const fixtureUrl = import.meta.resolve('../fixtures/git-api-deleted-file')
  await Command.execute('ExtensionHost.executeCommand', 'git.loadFixture', fixtureUrl)
  await Workspace.setPath(workspaceDir)
  await Settings.update({
    'git.confirmDiscard': false,
  })
  await FileSystem.writeFile(`${workspaceDir}/${fileName}`, 'modified nested content')

  await Command.execute('ExtensionHost.executeCommand', 'git.discard', fileName)

  await FileSystem.shouldHaveFile(`${workspaceDir}/${fileName}`, 'nested content')
}
