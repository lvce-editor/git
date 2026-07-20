import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.clean-all-untracked-directory'

export const test: Test = async ({ Command, FileSystem, Git, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const workspaceDir = `${tmpDir}/workspace`
  const folderName = 'generated'

  await Workspace.setPath(tmpDir)
  const fixtureUrl = import.meta.resolve('../fixtures/git-api-branch')
  await Command.execute('ExtensionHost.executeCommand', 'git.loadFixture', fixtureUrl)
  await Workspace.setPath(workspaceDir)
  await FileSystem.mkdir(`${workspaceDir}/${folderName}`)
  await FileSystem.writeFile(`${workspaceDir}/${folderName}/output.txt`, 'generated content')

  // act
  await Git.cleanAll()

  // assert
  const dirents = await FileSystem.readDir(workspaceDir)
  if (dirents.some((dirent) => dirent.name === folderName)) {
    throw new Error(`expected ${folderName} to be deleted`)
  }
  await Git.shouldHaveInvocations([
    {
      command: ['git', 'clean', '-fd'],
      cwd: workspaceDir,
    },
  ])
}
