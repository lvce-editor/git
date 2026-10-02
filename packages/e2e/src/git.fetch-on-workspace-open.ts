import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.fetch-on-workspace-open'

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

export const test: Test = async ({ Command, expect, FileSystem, Locator, Settings, SideBar, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const firstWorkspaceDir = `${tmpDir}/first-workspace`
  const secondWorkspaceDir = `${tmpDir}/second-workspace`
  const secondWorkspaceGitDir = `${secondWorkspaceDir}/.git`
  const upstreamGitDir = `${tmpDir}/upstream/.git`

  await Workspace.setUri(tmpDir)
  await Settings.update({
    'git.runFetchOnWorkspaceOpen': true,
  })
  const fixtureUrl = import.meta.resolve('../fixtures/git-fetch-on-workspace-open')
  await Command.execute('ExtensionHost.executeCommand', 'git.loadFixture', fixtureUrl)
  await Workspace.setUri(firstWorkspaceDir)
  await SideBar.open('Source Control')

  const remoteTrackingRefBeforeSwitch = await readGitRef(FileSystem, secondWorkspaceGitDir, 'refs/remotes/origin/main')
  const localHeadBeforeSwitch = await readGitRef(FileSystem, secondWorkspaceGitDir, 'refs/heads/main')
  const upstreamHead = await readGitRef(FileSystem, upstreamGitDir, 'refs/heads/main')
  if (remoteTrackingRefBeforeSwitch === upstreamHead) {
    throw new Error('expected the second workspace remote-tracking ref to be stale before switching workspaces')
  }
  if (remoteTrackingRefBeforeSwitch !== localHeadBeforeSwitch) {
    throw new Error('expected the second workspace local branch to match origin/main before switching workspaces')
  }

  await Workspace.setUri(secondWorkspaceDir)
  const syncStatusBarItem = Locator('.StatusBarItem[name="git.sync"]')
  await expect(syncStatusBarItem).toHaveText('2↓ 0↑')
  const fetchedRef = await readGitRef(FileSystem, secondWorkspaceGitDir, 'refs/remotes/origin/main')
  if (fetchedRef !== upstreamHead) {
    throw new Error(`expected refs/remotes/origin/main to be ${JSON.stringify(upstreamHead)}, got ${JSON.stringify(fetchedRef)}`)
  }
  const localHeadAfterSwitch = await readGitRef(FileSystem, secondWorkspaceGitDir, 'refs/heads/main')
  if (localHeadAfterSwitch !== localHeadBeforeSwitch) {
    throw new Error('expected automatic fetch not to move the second workspace local branch')
  }
  const fetchHead = await FileSystem.readFile(`${secondWorkspaceGitDir}/FETCH_HEAD`)
  if (!fetchHead.startsWith(upstreamHead.trim())) {
    throw new Error(`expected FETCH_HEAD to start with ${upstreamHead.trim()}, got ${fetchHead}`)
  }
}
