import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.branch-with-slash'

export const test: Test = async ({ Command, FileSystem, Git, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const workspaceDir = `${tmpDir}/workspace`
  const branchName = 'feature/nested'

  await Workspace.setPath(tmpDir)
  const fixtureUrl = import.meta.resolve('../fixtures/git-api-branch')
  await Command.execute('ExtensionHost.executeCommand', 'git.loadFixture', fixtureUrl)
  await Workspace.setPath(workspaceDir)

  // act
  await Git.branch(branchName)

  // assert
  const mainRef = await FileSystem.readFile(`${workspaceDir}/.git/refs/heads/main`)
  await FileSystem.shouldHaveFile(`${workspaceDir}/.git/refs/heads/${branchName}`, mainRef)
  await Git.shouldHaveInvocations([
    {
      command: ['git', 'branch', branchName],
      cwd: workspaceDir,
    },
  ])
}
