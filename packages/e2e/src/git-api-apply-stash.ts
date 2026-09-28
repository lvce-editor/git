import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.apply-stash'

export const test: Test = async ({ Command, FileSystem, Git, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const workspaceDir = `${tmpDir}/workspace`

  await Workspace.setUri(tmpDir)
  const fixtureUrl = import.meta.resolve('../fixtures/git-api-apply-stash')
  await Command.execute('ExtensionHost.executeCommand', 'git.loadFixture', fixtureUrl)
  await Workspace.setUri(workspaceDir)

  if ('applyStash' in Git) {
    // @ts-ignore
    await Git.applyStash()
  } else {
    await Command.execute('ExtensionHost.executeCommand', 'git.applyStash')
  }

  await FileSystem.shouldHaveFile(`${workspaceDir}/file.txt`, 'modified content')
  await Git.shouldHaveInvocations([
    {
      command: ['git', 'stash', 'apply'],
      cwd: decodeURIComponent(new URL(workspaceDir).pathname).replace(/^\/(?=[A-Za-z]:)/, ''),
    },
  ])
}
