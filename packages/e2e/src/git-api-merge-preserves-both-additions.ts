import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.merge-preserves-both-additions'

export const test: Test = async ({ Command, FileSystem, Git, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const workspaceDir = `${tmpDir}/workspace`
  await Workspace.setPath(tmpDir)
  await Command.execute('ExtensionHost.executeCommand', 'git.loadFixture', import.meta.resolve('../fixtures/git-api-branch'))
  await Workspace.setPath(workspaceDir)
  await Git.branch('docs')
  await Git.checkout('docs')
  await FileSystem.writeFile(`${workspaceDir}/guide.md`, '# Guide')
  await Git.add('guide.md')
  await Git.commit('add guide')
  await Git.checkout('main')
  await FileSystem.writeFile(`${workspaceDir}/license.txt`, 'MIT')
  await Git.add('license.txt')
  await Git.commit('add license')

  await Git.merge('docs')

  await FileSystem.shouldHaveFile(`${workspaceDir}/guide.md`, '# Guide')
  await FileSystem.shouldHaveFile(`${workspaceDir}/license.txt`, 'MIT')
  const index = await FileSystem.readFile(`${workspaceDir}/.git/index`)
  if (!index.includes('guide.md') || !index.includes('license.txt')) {
    throw new Error('expected merged index to contain additions from both branches')
  }
}
