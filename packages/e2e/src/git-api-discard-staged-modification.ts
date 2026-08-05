import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.discard-staged-modification'

export const test: Test = async ({ Command, FileSystem, Git, Settings, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const workspaceDir = `${tmpDir}/workspace`
  await Workspace.setPath(tmpDir)
  await Command.execute('ExtensionHost.executeCommand', 'git.loadFixture', import.meta.resolve('../fixtures/git-api-branch'))
  await Workspace.setPath(workspaceDir)
  await FileSystem.writeFile(`${workspaceDir}/file.txt`, 'staged content')
  await Git.stage('file.txt')
  await FileSystem.writeFile(`${workspaceDir}/file.txt`, 'working content')
  await Settings.update({ 'git.confirmDiscard': false })

  await Command.execute('ExtensionHost.executeCommand', 'git.discard', 'file.txt')

  await FileSystem.shouldHaveFile(`${workspaceDir}/file.txt`, 'staged content')
}
