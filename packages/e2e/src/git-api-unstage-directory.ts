import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.unstage-directory'

export const test: Test = async ({ Command, FileSystem, Git, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const workspaceDir = `${tmpDir}/workspace`
  await Workspace.setPath(tmpDir)
  await Command.execute('ExtensionHost.executeCommand', 'git.loadFixture', import.meta.resolve('../fixtures/git-api-branch'))
  await Workspace.setPath(workspaceDir)
  await FileSystem.mkdir(`${workspaceDir}/generated`)
  await FileSystem.setFiles([
    { content: 'one', uri: `${workspaceDir}/generated/one.txt` },
    { content: 'two', uri: `${workspaceDir}/generated/two.txt` },
  ])
  await Git.stage('generated')

  await Git.unstage('generated')

  const index = await FileSystem.readFile(`${workspaceDir}/.git/index`)
  if (index.includes('generated/one.txt') || index.includes('generated/two.txt')) {
    throw new Error('expected directory contents to be unstaged')
  }
}
