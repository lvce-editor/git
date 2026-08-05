import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.merge-non-fast-forward'

export const test: Test = async ({ Command, FileSystem, Git, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const workspaceDir = `${tmpDir}/workspace`
  await Workspace.setPath(tmpDir)
  await Command.execute('ExtensionHost.executeCommand', 'git.loadFixture', import.meta.resolve('../fixtures/git-api-branch'))
  await Workspace.setPath(workspaceDir)
  await Git.branch('feature')
  await Git.checkout('feature')
  await FileSystem.writeFile(`${workspaceDir}/feature.txt`, 'feature')
  await Git.add('feature.txt')
  await Git.commit('feature commit')
  await Git.checkout('main')
  await FileSystem.writeFile(`${workspaceDir}/main.txt`, 'main')
  await Git.add('main.txt')
  await Git.commit('main commit')
  const beforeMerge = await FileSystem.readFile(`${workspaceDir}/.git/refs/heads/main`)

  await Git.merge('feature')

  await FileSystem.shouldHaveFile(`${workspaceDir}/feature.txt`, 'feature')
  await FileSystem.shouldHaveFile(`${workspaceDir}/main.txt`, 'main')
  const afterMerge = await FileSystem.readFile(`${workspaceDir}/.git/refs/heads/main`)
  if (afterMerge === beforeMerge) {
    throw new Error('expected merge to create a new commit')
  }
}
