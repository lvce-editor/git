import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.branch-protection-unprotected'

export const test: Test = async ({ Command, Extension, FileSystem, Git, Workspace }) => {
  await Extension.addWebExtension(import.meta.resolve('../fixtures/branch-protection-dialog'))
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  await Workspace.setPath(tmpDir)
  await Command.execute('ExtensionHost.executeCommand', 'git.loadFixture', import.meta.resolve('../fixtures/git-api-push'))
  const workspaceDir = `${tmpDir}/workspace`
  await Workspace.setPath(workspaceDir)
  await FileSystem.writeFile(`${workspaceDir}/new-file.txt`, 'protected commit')
  await Git.stage('new-file.txt')
  await Command.execute('ExtensionHost.executeCommand', 'test.configureBranchDialog', 0)
  await Command.execute('ExtensionHost.executeCommand', 'git.branch', 'feature/existing')
  await Command.execute('ExtensionHost.executeCommand', 'git.checkout', 'feature/existing')
  const mainRef = await FileSystem.readFile(`${workspaceDir}/.git/refs/heads/main`)
  const committing = Command.execute('ExtensionHost.executeCommand', 'git.commit', 'Protected commit')
  await committing
  const options = await Command.execute('ExtensionHost.executeCommand', 'test.getBranchDialogOptions')
  if (options !== undefined && options !== null) {
    throw new Error(`Unexpected branch protection dialog: ${JSON.stringify(options)}`)
  }
  await FileSystem.shouldHaveFile(`${workspaceDir}/.git/HEAD`, 'ref: refs/heads/feature/existing\n')
  const commits1 = (await Command.execute('ExtensionHost.executeCommand', 'git.getCommits')) as readonly { readonly message: string }[]
  if (commits1[0]?.message !== 'Protected commit') {
    throw new Error(`Unexpected commits: ${JSON.stringify(commits1)}`)
  }
  await FileSystem.shouldHaveFile(`${workspaceDir}/.git/refs/heads/main`, mainRef)
}
