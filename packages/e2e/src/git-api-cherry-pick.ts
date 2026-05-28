import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.cherryPick'

export const skip = 1

export const test: Test = async ({ Command, FileSystem, Git, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const workspaceDir = `${tmpDir}/workspace`

  await Workspace.setPath(tmpDir)
  const fixtureUrl = import.meta.resolve('../fixtures/git-api-cherry-pick')
  await Command.execute('ExtensionHost.executeCommand', 'git.loadFixture', fixtureUrl)
  await Workspace.setPath(workspaceDir)

  const featureCommitHash = (await FileSystem.readFile(`${workspaceDir}/.git/refs/heads/feature`)).trim()

  // act
  await Git.cherryPick(featureCommitHash)

  // assert
  await FileSystem.shouldHaveFile(`${workspaceDir}/cherry-picked.txt`, 'picked content')
  const headContent = await FileSystem.readFile(`${workspaceDir}/.git/HEAD`)
  if (headContent !== 'ref: refs/heads/main\n') {
    throw new Error(`expected HEAD to stay on main, got ${headContent}`)
  }
  const commits = await Command.execute('ExtensionHost.executeCommand', 'git.getCommits')
  if (!Array.isArray(commits)) {
    throw new TypeError(`expected commits to be an array, got ${commits}`)
  }
  if (commits.length < 2) {
    throw new Error(`expected at least 2 commits after cherry-pick, got ${commits.length}`)
  }
  if (commits[0].message !== 'Feature commit') {
    throw new Error(`expected latest commit message to be Feature commit, got ${commits[0].message}`)
  }
  await Git.shouldHaveInvocations([
    {
      command: ['git', 'cherry-pick', featureCommitHash],
      cwd: workspaceDir,
    },
  ])
}
