import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.clean-all-empty-directory'

export const test: Test = async ({ Command, FileSystem, Git, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const workspaceDir = `${tmpDir}/workspace`
  await Workspace.setPath(tmpDir)
  await Command.execute('ExtensionHost.executeCommand', 'git.loadFixture', import.meta.resolve('../fixtures/git-api-branch'))
  await Workspace.setPath(workspaceDir)
  await FileSystem.mkdir(`${workspaceDir}/empty`)

  await Git.cleanAll()

  const entries = await FileSystem.readDir(workspaceDir)
  if (entries.some((entry) => entry.name === 'empty')) {
    throw new Error('expected empty untracked directory to be removed')
  }
}
