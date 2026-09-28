import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.push-no-options'

const waitForRemoteBranch = async (FileSystem: { readFile: (uri: string) => Promise<string> }, remoteBranchPath: string): Promise<void> => {
  for (let i = 0; i < 20; i++) {
    try {
      await FileSystem.readFile(remoteBranchPath)
      return
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 100))
    }
  }
  await FileSystem.readFile(remoteBranchPath)
}

export const test: Test = async ({ Command, FileSystem, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const workspaceDir = `${tmpDir}/workspace`
  const verifyDir = `${tmpDir}/verify`

  await Workspace.setPath(tmpDir)
  const setupFixtureUrl = import.meta.resolve('../fixtures/git-api-push')
  await Command.execute('ExtensionHost.executeCommand', 'git.loadFixture', setupFixtureUrl)
  await Workspace.setPath(workspaceDir)

  await Command.execute('ExtensionHost.executeCommand', 'git.push')
  const invocations = await Command.execute('ExtensionHost.executeCommand', 'git.getInvocations')
  const pushInvocations = invocations.filter(({ command }) => command[1] === 'push')
  if (pushInvocations.length !== 1 || pushInvocations[0].cwd !== workspaceDir) {
    throw new Error(`expected one push in ${workspaceDir}, got ${JSON.stringify(pushInvocations)}`)
  }
  await waitForRemoteBranch(FileSystem, `${tmpDir}/remote.git/refs/heads/main`)

  await Workspace.setPath(tmpDir)
  const verifyFixtureUrl = import.meta.resolve('../fixtures/git-api-push-verify')
  await Command.execute('ExtensionHost.executeCommand', 'git.loadFixture', verifyFixtureUrl)
  const content = await FileSystem.readFile(`${verifyDir}/new-file.txt`)
  if (content !== 'pushed content') {
    throw new Error(`expected pushed content, got ${content}`)
  }
}
