import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.status-bar-incoming-on-workspace-open'

const readGitRef = async (FileSystem: { readFile(path: string): Promise<string> }, gitDir: string, refName: string): Promise<string> => {
  try {
    return await FileSystem.readFile(`${gitDir}/${refName}`)
  } catch {
    const packedRefs = await FileSystem.readFile(`${gitDir}/packed-refs`)
    const line = packedRefs.split('\n').find((candidate) => candidate.endsWith(` ${refName}`))
    if (!line) {
      throw new Error(`File not found: ${gitDir}/${refName}`)
    }
    const [hash] = line.split(' ')
    return `${hash}\n`
  }
}

export const test: Test = async ({ Command, expect, FileSystem, Locator, Settings, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const workspaceDir = `${tmpDir}/second-workspace`
  const workspaceGitDir = `${workspaceDir}/.git`
  const upstreamGitDir = `${tmpDir}/upstream/.git`

  await Workspace.setUri(tmpDir)
  await Settings.update({
    'git.runFetchOnWorkspaceOpen': true,
  })
  const fixtureUrl = import.meta.resolve('../fixtures/git-fetch-on-workspace-open')
  await Command.execute('ExtensionHost.executeCommand', 'git.loadFixture', fixtureUrl)

  await Workspace.setUri(workspaceDir)
  const upstreamHead = await FileSystem.readFile(`${upstreamGitDir}/refs/heads/main`)

  const syncStatusBarItem = Locator('.StatusBarItem[name="git.sync"]')
  await expect(syncStatusBarItem).toBeVisible()
  await expect(syncStatusBarItem).toHaveText('2↓ 0↑')
  const fetchedHead = await readGitRef(FileSystem, workspaceGitDir, 'refs/remotes/origin/main')
  if (fetchedHead !== upstreamHead) {
    throw new Error(`expected origin/main to be ${JSON.stringify(upstreamHead)}, got ${JSON.stringify(fetchedHead)}`)
  }
  await expect(syncStatusBarItem).toHaveText('2↓ 0↑')
  await expect(syncStatusBarItem).toHaveAttribute('aria-label', 'second-workspace (Git) - Pull 2 commits from origin/main')
}
