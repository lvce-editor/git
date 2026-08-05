import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.unstage-restaged-file'

export const test: Test = async ({ Command, FileSystem, Git, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const workspaceDir = `${tmpDir}/workspace`
  await Workspace.setPath(tmpDir)
  await Command.execute('ExtensionHost.executeCommand', 'git.loadFixture', import.meta.resolve('../fixtures/git-api-branch'))
  await Workspace.setPath(workspaceDir)
  await FileSystem.writeFile(`${workspaceDir}/file.txt`, 'first change')
  await Git.stage('file.txt')
  await FileSystem.writeFile(`${workspaceDir}/file.txt`, 'second change')
  await Git.stage('file.txt')

  await Git.unstage('file.txt')

  await FileSystem.shouldHaveFile(`${workspaceDir}/file.txt`, 'second change')
  const index = await FileSystem.readFile(`${workspaceDir}/.git/index`)
  if (!index.includes('file.txt')) {
    throw new Error('expected tracked file to remain in the index after unstage')
  }
}
