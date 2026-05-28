import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.deleteBranch'

// export const skip = 1

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
  const headContent = await FileSystem.readFile(`${workspaceDir}/.git/HEAD`)
  if (headContent !== 'ref: refs/heads/main\n') {
    throw new Error(`expected HEAD to stay on main, got ${headContent}`)
  }
  const branchRefs = await FileSystem.readDir(`${workspaceDir}/.git/refs/heads`)
  if (branchRefs.some((dirent) => dirent.name === branchName)) {
    throw new Error(`expected refs/heads/${branchName} to be removed`)
  }
  const fileContent = await FileSystem.readFile(`${workspaceDir}/file.txt`)
  if (fileContent !== 'main branch') {
    throw new Error(`expected main branch content, got ${fileContent}`)
  }
  await Git.shouldHaveInvocations([
    {
      command: ['git', 'branch', '-d', branchName],
      cwd: workspaceDir,
    },
  ])
}
