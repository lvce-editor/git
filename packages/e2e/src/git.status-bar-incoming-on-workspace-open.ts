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

const waitForGitRef = async (
  FileSystem: { readFile(path: string): Promise<string> },
  gitDir: string,
  refName: string,
  expected: string,
): Promise<void> => {
  for (let i = 0; i < 50; i++) {
    const actual = await readGitRef(FileSystem, gitDir, refName)
    if (actual === expected) {
      return
    }
    await new Promise((resolve) => setTimeout(resolve, 100))
  }
  const actual = await readGitRef(FileSystem, gitDir, refName)
  throw new Error(`expected ${refName} to be ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`)
}

export const test: Test = async ({ Command, expect, FileSystem, Locator, Settings, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const workspaceDir = `${tmpDir}/second-workspace`
  const workspaceGitDir = `${workspaceDir}/.git`
  const upstreamGitDir = `${tmpDir}/upstream/.git`

  await Workspace.setPath(tmpDir)
  await Settings.update({
    'git.runFetchOnWorkspaceOpen': true,
  })
  const fixtureUrl = import.meta.resolve('../fixtures/git-fetch-on-workspace-open')
  await Command.execute('ExtensionHost.executeCommand', 'git.loadFixture', fixtureUrl)

  await Workspace.setPath(workspaceDir)
  const upstreamHead = await FileSystem.readFile(`${upstreamGitDir}/refs/heads/main`)
  await waitForGitRef(FileSystem, workspaceGitDir, 'refs/remotes/origin/main', upstreamHead)

  const syncStatusBarItem = Locator('.StatusBarItem[name="git.sync"]')
  await expect(syncStatusBarItem).toBeVisible()
  await expect(syncStatusBarItem).toHaveText('2↓ 0↑')
  await expect(syncStatusBarItem).toHaveAttribute('aria-label', 'second-workspace (Git) - Pull 2 commits from origin/main')
}
