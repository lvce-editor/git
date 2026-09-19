import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.commit-and-sync-repeated'

const waitForRemoteRef = async (FileSystem: { readFile: (uri: string) => Promise<string> }, workspaceDir: string, branch: string): Promise<void> => {
  const localRef = `${workspaceDir}/.git/refs/heads/${branch}`
  const remoteRef = `${workspaceDir}/../remote.git/refs/heads/${branch}`
  for (let i = 0; i < 20; i++) {
    try {
      const [local, remote] = await Promise.all([FileSystem.readFile(localRef), FileSystem.readFile(remoteRef)])
      if (local === remote) {
        return
      }
    } catch {
      // The commit or push has not completed yet.
    }
    await new Promise((resolve) => setTimeout(resolve, 100))
  }
  const [local, remote] = await Promise.all([FileSystem.readFile(localRef), FileSystem.readFile(remoteRef)])
  throw new Error(`expected ${branch} to be pushed, got local ${local} and remote ${remote}`)
}

export const test: Test = async ({ Command, FileSystem, Git, Settings, SourceControl, Workspace }) => {
  await Settings.update({ 'git.branchProtection': false })
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  await Workspace.setPath(tmpDir)
  await Command.execute('ExtensionHost.executeCommand', 'git.loadFixture', import.meta.resolve('../fixtures/git-api-push'))
  const workspaceDir = `${tmpDir}/workspace`
  await Workspace.setPath(workspaceDir)
  await Git.push({ setUpstream: ['origin', 'main'] })
  await Git.branch('feature')
  await Git.checkout('feature')
  await Git.push({ setUpstream: ['origin', 'feature'] })

  const commitAndSync = async (branch: string, fileName: string, message: string): Promise<void> => {
    await FileSystem.writeFile(`${workspaceDir}/${fileName}`, message)
    await Git.stage(fileName)
    await SourceControl.show()
    await SourceControl.handleInput(message)
    await Command.execute('ExtensionHost.executeCommand', 'git.commitAndSync', message)
    await waitForRemoteRef(FileSystem, workspaceDir, branch)
  }

  await commitAndSync('feature', 'feature.txt', 'Feature commit')
  await Git.checkout('main')
  await commitAndSync('main', 'main.txt', 'First main commit')
  await commitAndSync('main', 'second-main.txt', 'Second main commit')
}
