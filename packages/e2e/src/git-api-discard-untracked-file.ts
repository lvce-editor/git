import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.discard-untracked-file'

export const test: Test = async ({ Command, FileSystem, Git, Settings, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const workspaceDir = `${tmpDir}/workspace`
  await Workspace.setPath(tmpDir)
  await Command.execute('ExtensionHost.executeCommand', 'git.loadFixture', import.meta.resolve('../fixtures/git-api-branch'))
  await Workspace.setPath(workspaceDir)
  await FileSystem.writeFile(`${workspaceDir}/scratch.txt`, 'scratch')
  await Settings.update({ 'git.confirmDiscard': false })

  await Command.execute('ExtensionHost.executeCommand', 'git.discard', 'scratch.txt')

  const entries = await FileSystem.readDir(workspaceDir)
  if (entries.some((entry) => entry.name === 'scratch.txt')) {
    throw new Error('expected discarded untracked file to be deleted')
  }
}
