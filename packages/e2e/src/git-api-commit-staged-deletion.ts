import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.commit-staged-deletion'

export const test: Test = async ({ Command, FileSystem, Git, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const workspaceDir = `${tmpDir}/workspace`
  const deletedFile = 'deleted.txt'

  await Workspace.setPath(tmpDir)
  const fixtureUrl = import.meta.resolve('../fixtures/git-api-deleted-file')
  await Command.execute('ExtensionHost.executeCommand', 'git.loadFixture', fixtureUrl)
  await Workspace.setPath(workspaceDir)
  await Git.stage(deletedFile)

  await Command.execute('ExtensionHost.executeCommand', 'git.commitStaged', 'remove deleted file')

  const commits = (await Command.execute('ExtensionHost.executeCommand', 'git.getCommits')) as readonly { readonly message: string }[]
  if (commits[0]?.message !== 'remove deleted file') {
    throw new Error(`expected deletion commit, got ${JSON.stringify(commits)}`)
  }
  await FileSystem.shouldHaveFile(`${workspaceDir}/nested/file.txt`, 'nested content')
}
