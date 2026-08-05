import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.branch-at-latest-commit'

export const test: Test = async ({ Command, FileSystem, Git, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const workspaceDir = `${tmpDir}/workspace`
  await Workspace.setPath(tmpDir)
  await Command.execute('ExtensionHost.executeCommand', 'git.loadFixture', import.meta.resolve('../fixtures/git-api-branch'))
  await Workspace.setPath(workspaceDir)
  await FileSystem.writeFile(`${workspaceDir}/second.txt`, 'second')
  await Git.add('second.txt')
  await Git.commit('second commit')

  await Git.branch('after-second')

  const main = await FileSystem.readFile(`${workspaceDir}/.git/refs/heads/main`)
  await FileSystem.shouldHaveFile(`${workspaceDir}/.git/refs/heads/after-second`, main)
}
