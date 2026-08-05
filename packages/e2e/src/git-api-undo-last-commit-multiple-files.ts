import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.undo-last-commit-multiple-files'

export const test: Test = async ({ Command, FileSystem, Git, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const workspaceDir = `${tmpDir}/workspace`
  await Workspace.setPath(tmpDir)
  await Command.execute('ExtensionHost.executeCommand', 'git.loadFixture', import.meta.resolve('../fixtures/git-api-branch'))
  await Workspace.setPath(workspaceDir)
  const previousHead = await FileSystem.readFile(`${workspaceDir}/.git/refs/heads/main`)
  await FileSystem.setFiles([
    { content: 'one', uri: `${workspaceDir}/one.txt` },
    { content: 'two', uri: `${workspaceDir}/two.txt` },
  ])
  await Git.addAll()
  await Git.commit('add two files')

  await Git.undoLastCommit()

  await FileSystem.shouldHaveFile(`${workspaceDir}/.git/refs/heads/main`, previousHead)
  const index = await FileSystem.readFile(`${workspaceDir}/.git/index`)
  if (!index.includes('one.txt') || !index.includes('two.txt')) {
    throw new Error('expected both undone files to remain staged')
  }
}
