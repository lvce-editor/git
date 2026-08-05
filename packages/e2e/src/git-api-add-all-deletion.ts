import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.add-all-deletion'

export const test: Test = async ({ Command, FileSystem, Git, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const workspaceDir = `${tmpDir}/workspace`
  await Workspace.setPath(tmpDir)
  await Command.execute('ExtensionHost.executeCommand', 'git.loadFixture', import.meta.resolve('../fixtures/git-api-branch'))
  await Workspace.setPath(workspaceDir)
  await FileSystem.remove(`${workspaceDir}/file.txt`)

  await Git.addAll()

  const index = await FileSystem.readFile(`${workspaceDir}/.git/index`)
  if (index.includes('file.txt')) {
    throw new Error('expected add all to stage tracked deletion')
  }
}
