import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.create-tag-latest-commit'

export const test: Test = async ({ Command, FileSystem, Git, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const workspaceDir = `${tmpDir}/workspace`
  await Workspace.setPath(tmpDir)
  await Command.execute('ExtensionHost.executeCommand', 'git.loadFixture', import.meta.resolve('../fixtures/git-api-branch'))
  await Workspace.setPath(workspaceDir)
  await FileSystem.writeFile(`${workspaceDir}/second.txt`, 'second')
  await Git.add('second.txt')
  await Git.commit('second commit')

  await Git.createTag('v2')

  const head = await FileSystem.readFile(`${workspaceDir}/.git/refs/heads/main`)
  await FileSystem.shouldHaveFile(`${workspaceDir}/.git/refs/tags/v2`, head)
}
