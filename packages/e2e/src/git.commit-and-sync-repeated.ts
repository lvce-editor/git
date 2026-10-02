import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.commit-and-sync-repeated'

export const test: Test = async ({ Command, expect, FileSystem, Git, Locator, Settings, SourceControl, Workspace }) => {
  await Settings.update({ 'git.branchProtection': false })
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  await Workspace.setUri(tmpDir)
  await Command.execute('ExtensionHost.executeCommand', 'git.loadFixture', import.meta.resolve('../fixtures/git-api-push'))
  const workspaceDir = `${tmpDir}/workspace`
  await Workspace.setUri(workspaceDir)
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
    const syncStatusBarItem = Locator('.StatusBarItem[name="git.sync"]')
    await expect(syncStatusBarItem).toHaveText('0↓ 0↑')
    const [localRef, remoteRef] = await Promise.all([
      FileSystem.readFile(`${workspaceDir}/.git/refs/heads/${branch}`),
      FileSystem.readFile(`${workspaceDir}/../remote.git/refs/heads/${branch}`),
    ])
    if (localRef !== remoteRef) {
      throw new Error(`expected ${branch} to be pushed, got local ${localRef} and remote ${remoteRef}`)
    }
  }

  await commitAndSync('feature', 'feature.txt', 'Feature commit')
  await Git.checkout('main')
  await commitAndSync('main', 'main.txt', 'First main commit')
  await commitAndSync('main', 'second-main.txt', 'Second main commit')
}
