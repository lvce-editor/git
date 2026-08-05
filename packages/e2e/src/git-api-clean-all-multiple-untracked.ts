import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.clean-all-multiple-untracked'

export const test: Test = async ({ Command, FileSystem, Git, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const workspaceDir = `${tmpDir}/workspace`
  await Workspace.setPath(tmpDir)
  await Command.execute('ExtensionHost.executeCommand', 'git.loadFixture', import.meta.resolve('../fixtures/git-api-branch'))
  await Workspace.setPath(workspaceDir)
  await FileSystem.setFiles([
    { content: 'one', uri: `${workspaceDir}/one.tmp` },
    { content: 'two', uri: `${workspaceDir}/two.tmp` },
  ])

  await Git.cleanAll()

  const entries = await FileSystem.readDir(workspaceDir)
  if (entries.some((entry) => entry.name === 'one.tmp' || entry.name === 'two.tmp')) {
    throw new Error('expected all untracked files to be removed')
  }
  await FileSystem.shouldHaveFile(`${workspaceDir}/file.txt`, 'main branch')
}
