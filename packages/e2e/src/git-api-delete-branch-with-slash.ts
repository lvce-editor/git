import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.delete-branch-with-slash'

export const test: Test = async ({ Command, FileSystem, Git, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const workspaceDir = `${tmpDir}/workspace`
  await Workspace.setPath(tmpDir)
  await Command.execute('ExtensionHost.executeCommand', 'git.loadFixture', import.meta.resolve('../fixtures/git-api-branch'))
  await Workspace.setPath(workspaceDir)
  await Git.branch('feature/nested')

  await Git.deleteBranch('feature/nested')

  const refs = await FileSystem.readDir(`${workspaceDir}/.git/refs/heads`)
  if (refs.some((entry) => entry.name === 'feature')) {
    throw new Error('expected nested branch ref to be deleted')
  }
}
