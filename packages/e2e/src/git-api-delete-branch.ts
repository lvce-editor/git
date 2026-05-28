import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.deleteBranch'

export const test: Test = async ({ Command, FileSystem, Git, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const workspaceDir = `${tmpDir}/workspace`
  const branchName = 'feature'

  await Workspace.setPath(tmpDir)
  const fixtureUrl = import.meta.resolve('../fixtures/git-api-delete-branch')
  await Command.execute('ExtensionHost.executeCommand', 'git.loadFixture', fixtureUrl)
  await Workspace.setPath(workspaceDir)

  // act
  await Git.deleteBranch(branchName)

  // assert
  await FileSystem.shouldHaveFile(`${workspaceDir}/.git/HEAD`, 'ref: refs/heads/main\n')
  const branchRefs = await FileSystem.readDir(`${workspaceDir}/.git/refs/heads`)
  if (branchRefs.some((dirent) => dirent.name === branchName)) {
    throw new Error(`expected refs/heads/${branchName} to be removed`)
  }
  await FileSystem.shouldHaveFile(`${workspaceDir}/file.txt`, 'main branch')
  await Git.shouldHaveInvocations([
    {
      command: ['git', 'branch', '-d', branchName],
      cwd: workspaceDir,
    },
  ])
}
