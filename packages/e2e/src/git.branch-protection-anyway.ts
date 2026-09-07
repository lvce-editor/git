import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.branch-protection-anyway'

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
  const committing = Command.execute('ExtensionHost.executeCommand', 'git.commitStaged', 'Protected commit')
  await committing
  const options = await Command.execute('ExtensionHost.executeCommand', 'test.getBranchDialogOptions')
  const expected = {
    buttons: ['Commit Anyway', 'Cancel', 'Commit to a New Branch'],
    defaultId: 2,
    message: 'You are trying to commit to a protected branch. How would you like to proceed?',
    type: 'warning',
  }
  if (JSON.stringify(options) !== JSON.stringify(expected)) {
    throw new Error(`Unexpected branch protection dialog: ${JSON.stringify(options)}`)
  }
  await FileSystem.shouldHaveFile(`${workspaceDir}/.git/HEAD`, 'ref: refs/heads/main\n')
  const commits1 = (await Command.execute('ExtensionHost.executeCommand', 'git.getCommits')) as readonly { readonly message: string }[]
  if (commits1[0]?.message !== 'Protected commit') {
    throw new Error(`Unexpected commits: ${JSON.stringify(commits1)}`)
  }
}
