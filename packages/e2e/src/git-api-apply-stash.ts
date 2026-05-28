import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.apply-stash'

export const test: Test = async ({ Command, FileSystem, Git, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const workspaceDir = `${tmpDir}/workspace`

  await Workspace.setPath(tmpDir)
  const fixtureUrl = import.meta.resolve('../fixtures/git-api-apply-stash')
  await Command.execute('ExtensionHost.executeCommand', 'git.loadFixture', fixtureUrl)
  await Workspace.setPath(workspaceDir)

  if ('applyStash' in Git) {
    // @ts-ignore
    await Git.applyStash()
  } else {
    await Command.execute('ExtensionHost.executeCommand', 'git.applyStash')
  }

  const fileContent = await FileSystem.readFile(`${workspaceDir}/file.txt`)
  if (fileContent !== 'modified content') {
    throw new Error(`expected stashed changes to be applied, got ${fileContent}`)
  }
  await Git.shouldHaveInvocations([
    {
      command: ['git', 'stash', 'apply'],
      cwd: workspaceDir,
    },
  ])
}
