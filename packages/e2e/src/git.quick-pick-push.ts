import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.push-no-options'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const workspaceDir = `${tmpDir}/workspace`
  const verifyDir = `${tmpDir}/verify`

  await Workspace.setUri(tmpDir)
  const setupFixtureUrl = import.meta.resolve('../fixtures/git-api-push')
  await Command.execute('ExtensionHost.executeCommand', 'git.loadFixture', setupFixtureUrl)
  await Workspace.setUri(workspaceDir)
  const workspacePath = await Command.execute('Workspace.getPath')

  await Command.execute('ExtensionHost.executeCommand', 'git.push')
  const invocations = await Command.execute('ExtensionHost.executeCommand', 'git.getInvocations')
  const pushInvocations = invocations.filter(({ command }) => command[1] === 'push')
  if (pushInvocations.length !== 1 || pushInvocations[0].cwd !== workspacePath) {
    throw new Error(`expected one push in ${workspacePath}, got ${JSON.stringify(pushInvocations)}`)
  }
  const syncStatusBarItem = Locator('.StatusBarItem[name="git.sync"]')
  await expect(syncStatusBarItem).toHaveText('0↓ 0↑')
  const localHead = await FileSystem.readFile(`${workspaceDir}/.git/refs/heads/main`)
  await FileSystem.shouldHaveFile(`${tmpDir}/remote.git/refs/heads/main`, localHead)

  await Workspace.setUri(tmpDir)
  const verifyFixtureUrl = import.meta.resolve('../fixtures/git-api-push-verify')
  await Command.execute('ExtensionHost.executeCommand', 'git.loadFixture', verifyFixtureUrl)
  const content = await FileSystem.readFile(`${verifyDir}/new-file.txt`)
  if (content !== 'pushed content') {
    throw new Error(`expected pushed content, got ${content}`)
  }
}
