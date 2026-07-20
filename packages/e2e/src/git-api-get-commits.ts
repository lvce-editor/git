import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.get-commits'

type GitCommit = {
  readonly hash: string
  readonly message: string
}

export const test: Test = async ({ Command, FileSystem, Git, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const workspaceDir = `${tmpDir}/workspace`

  await Workspace.setPath(tmpDir)
  const fixtureUrl = import.meta.resolve('../fixtures/git-api-branch')
  await Command.execute('ExtensionHost.executeCommand', 'git.loadFixture', fixtureUrl)
  await Workspace.setPath(workspaceDir)

  // act
  const commits = (await Command.execute('ExtensionHost.executeCommand', 'git.getCommits')) as readonly GitCommit[]

  // assert
  if (commits.length !== 1 || commits[0].message !== 'Initial commit' || !commits[0].hash) {
    throw new Error(`expected initial commit, got ${JSON.stringify(commits)}`)
  }
  await Git.shouldHaveInvocations([
    {
      command: ['git', 'log', '--format=%H%x09%s'],
      cwd: workspaceDir,
    },
  ])
}
