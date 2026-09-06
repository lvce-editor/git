import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.pull-request-defaults'

export const test: Test = async ({ Command, FileSystem, Settings, Workspace }) => {
  await Settings.update({ 'git.runFetchOnWorkspaceOpen': false })
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  await Workspace.setPath(tmpDir)
  await Command.execute('ExtensionHost.executeCommand', 'git.loadFixture', import.meta.resolve('../fixtures/git-pr-defaults'))
  await Workspace.setPath(`${tmpDir}/workspace`)
  const result = (await Command.execute('ExtensionHost.executeCommand', 'git.getPullRequestDefaults')) as {
    readonly baseBranch: string
    readonly headBranch: string
    readonly remoteUrl: string
    readonly title: string
  }
  if (
    result.baseBranch !== 'main' ||
    result.headBranch !== 'feature/pr' ||
    result.title !== 'feature: create pull requests' ||
    result.remoteUrl !== 'https://github.com/lvce-editor/pull-request-github.git'
  ) {
    throw new Error(`Unexpected pull request defaults: ${JSON.stringify(result)}`)
  }
}
