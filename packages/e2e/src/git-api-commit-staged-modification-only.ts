import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.commit-staged-modification-only'

export const test: Test = async ({ Command, FileSystem, Git, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const workspaceDir = `${tmpDir}/workspace`
  await Workspace.setPath(tmpDir)
  await Command.execute('ExtensionHost.executeCommand', 'git.loadFixture', import.meta.resolve('../fixtures/git-api-branch'))
  await Workspace.setPath(workspaceDir)
  await FileSystem.setFiles([
    { content: 'staged change', uri: `${workspaceDir}/file.txt` },
    { content: 'not staged', uri: `${workspaceDir}/untracked.txt` },
  ])
  await Git.stage('file.txt')

  await Command.execute('ExtensionHost.executeCommand', 'git.commitStaged', 'commit tracked modification')

  await Git.shouldHaveCommit('commit tracked modification')
  const index = await FileSystem.readFile(`${workspaceDir}/.git/index`)
  if (index.includes('untracked.txt')) {
    throw new Error('expected untracked file to remain outside the commit')
  }
}
