import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.undo-last-commit-deletion'

export const test: Test = async ({ Command, FileSystem, Git, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const workspaceDir = `${tmpDir}/workspace`
  await Workspace.setPath(tmpDir)
  await Command.execute('ExtensionHost.executeCommand', 'git.loadFixture', import.meta.resolve('../fixtures/git-api-branch'))
  await Workspace.setPath(workspaceDir)
  const previousHead = await FileSystem.readFile(`${workspaceDir}/.git/refs/heads/main`)
  await FileSystem.remove(`${workspaceDir}/file.txt`)
  await Command.execute('ExtensionHost.executeCommand', 'git.stageAll')
  await Git.commit('delete file')

  await Git.undoLastCommit()

  await FileSystem.shouldHaveFile(`${workspaceDir}/.git/refs/heads/main`, previousHead)
  const index = await FileSystem.readFile(`${workspaceDir}/.git/index`)
  if (index.includes('file.txt')) {
    throw new Error('expected undone deletion to remain staged')
  }
}
