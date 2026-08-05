import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.checkout-unicode-branch'

export const test: Test = async ({ Command, FileSystem, Git, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const workspaceDir = `${tmpDir}/workspace`
  const branch = '功能'
  await Workspace.setPath(tmpDir)
  await Command.execute('ExtensionHost.executeCommand', 'git.loadFixture', import.meta.resolve('../fixtures/git-api-branch'))
  await Workspace.setPath(workspaceDir)
  await Git.branch(branch)

  await Git.checkout(branch)

  await FileSystem.shouldHaveFile(`${workspaceDir}/.git/HEAD`, `ref: refs/heads/${branch}\n`)
}
