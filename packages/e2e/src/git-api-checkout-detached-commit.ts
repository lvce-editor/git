import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.checkout-detached-commit'

export const test: Test = async ({ Command, FileSystem, Git, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const workspaceDir = `${tmpDir}/workspace`
  await Workspace.setPath(tmpDir)
  await Command.execute('ExtensionHost.executeCommand', 'git.loadFixture', import.meta.resolve('../fixtures/git-api-branch'))
  await Workspace.setPath(workspaceDir)
  const mainRef = await FileSystem.readFile(`${workspaceDir}/.git/refs/heads/main`)
  const commit = mainRef.trim()

  await Git.checkout(commit)

  await FileSystem.shouldHaveFile(`${workspaceDir}/.git/HEAD`, `${commit}\n`)
  await FileSystem.shouldHaveFile(`${workspaceDir}/file.txt`, 'main branch')
}
