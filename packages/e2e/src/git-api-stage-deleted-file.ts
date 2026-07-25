import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.stage-deleted-file'

export const test: Test = async ({ Command, FileSystem, Git, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const workspaceDir = `${tmpDir}/workspace`
  const fileName = 'deleted.txt'

  await Workspace.setPath(tmpDir)
  const fixtureUrl = import.meta.resolve('../fixtures/git-api-deleted-file')
  await Command.execute('ExtensionHost.executeCommand', 'git.loadFixture', fixtureUrl)
  await Workspace.setPath(workspaceDir)

  await Git.stage(fileName)
  await Git.commit('delete file')

  const entries = await FileSystem.readDir(workspaceDir)
  if (entries.some((entry) => entry.name === fileName)) {
    throw new Error(`expected ${fileName} to remain deleted`)
  }
}
