import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.stash-multiple-files'

export const test: Test = async ({ Command, FileSystem, Git, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const workspaceDir = `${tmpDir}/workspace`
  await Workspace.setPath(tmpDir)
  await Command.execute('ExtensionHost.executeCommand', 'git.loadFixture', import.meta.resolve('../fixtures/git-api-branch'))
  await Workspace.setPath(workspaceDir)
  await FileSystem.writeFile(`${workspaceDir}/second.txt`, 'base second')
  await Git.add('second.txt')
  await Git.commit('add second')
  await FileSystem.setFiles([
    { content: 'changed first', uri: `${workspaceDir}/file.txt` },
    { content: 'changed second', uri: `${workspaceDir}/second.txt` },
  ])

  await Git.stash()

  await FileSystem.shouldHaveFile(`${workspaceDir}/file.txt`, 'main branch')
  await FileSystem.shouldHaveFile(`${workspaceDir}/second.txt`, 'base second')
}
