import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.checkout-restores-branch-content'

export const test: Test = async ({ Command, FileSystem, Git, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const workspaceDir = `${tmpDir}/workspace`
  await Workspace.setPath(tmpDir)
  await Command.execute('ExtensionHost.executeCommand', 'git.loadFixture', import.meta.resolve('../fixtures/git-api-branch'))
  await Workspace.setPath(workspaceDir)
  await Git.branch('feature')
  await Git.checkout('feature')
  await FileSystem.writeFile(`${workspaceDir}/file.txt`, 'feature branch')
  await Git.add('file.txt')
  await Git.commit('feature content')

  await Git.checkout('main')

  await FileSystem.shouldHaveFile(`${workspaceDir}/file.txt`, 'main branch')
}
