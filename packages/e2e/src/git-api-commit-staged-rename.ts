import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.commit-staged-rename'

type GitCommit = {
  readonly message: string
}

export const test: Test = async ({ Command, FileSystem, Git, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const workspaceDir = `${tmpDir}/workspace`
  await Workspace.setPath(tmpDir)
  await Command.execute('ExtensionHost.executeCommand', 'git.loadFixture', import.meta.resolve('../fixtures/git-api-branch'))
  await Workspace.setPath(workspaceDir)
  await FileSystem.rename(`${workspaceDir}/file.txt`, `${workspaceDir}/renamed.txt`)
  await Command.execute('ExtensionHost.executeCommand', 'git.stageAll')

  await Command.execute('ExtensionHost.executeCommand', 'git.commitStaged', 'rename file')

  const commits = (await Command.execute('ExtensionHost.executeCommand', 'git.getCommits')) as readonly GitCommit[]
  if (commits[0]?.message !== 'rename file') {
    throw new Error(`expected rename commit, got ${JSON.stringify(commits)}`)
  }
  await FileSystem.shouldHaveFile(`${workspaceDir}/renamed.txt`, 'main branch')
  const index = await FileSystem.readFile(`${workspaceDir}/.git/index`)
  if (index.includes('file.txt') || !index.includes('renamed.txt')) {
    throw new Error('expected only renamed path in committed index')
  }
}
