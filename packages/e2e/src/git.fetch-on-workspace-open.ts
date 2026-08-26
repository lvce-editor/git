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

const waitForGitRef = async (
  FileSystem: { readFile(path: string): Promise<string> },
  gitDir: string,
  refName: string,
  expected: string,
): Promise<void> => {
  for (let i = 0; i < 30; i++) {
    const actual = await readGitRef(FileSystem, gitDir, refName)
    if (actual === expected) {
      return
    }
    await new Promise((resolve) => setTimeout(resolve, 100))
  }
  const actual = await readGitRef(FileSystem, gitDir, refName)
  throw new Error(`expected ${refName} to be ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`)
}

export const test: Test = async ({ Command, FileSystem, Settings, SideBar, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const firstWorkspaceDir = `${tmpDir}/first-workspace`
  const secondWorkspaceDir = `${tmpDir}/second-workspace`
  const secondWorkspaceGitDir = `${secondWorkspaceDir}/.git`
  const upstreamGitDir = `${tmpDir}/upstream/.git`

  await Workspace.setPath(tmpDir)
  await Settings.update({
    'git.runFetchOnWorkspaceOpen': true,
  })
  const fixtureUrl = import.meta.resolve('../fixtures/git-fetch-on-workspace-open')
  await Command.execute('ExtensionHost.executeCommand', 'git.loadFixture', fixtureUrl)
  await Workspace.setPath(firstWorkspaceDir)
  await SideBar.open('Source Control')
  await new Promise((resolve) => setTimeout(resolve, 2000))

  const remoteTrackingRefBeforeSwitch = await readGitRef(FileSystem, secondWorkspaceGitDir, 'refs/remotes/origin/main')
  const localHeadBeforeSwitch = await readGitRef(FileSystem, secondWorkspaceGitDir, 'refs/heads/main')
  const upstreamHead = await readGitRef(FileSystem, upstreamGitDir, 'refs/heads/main')
  if (remoteTrackingRefBeforeSwitch === upstreamHead) {
    throw new Error('expected the second workspace remote-tracking ref to be stale before switching workspaces')
  }
  if (remoteTrackingRefBeforeSwitch !== localHeadBeforeSwitch) {
    throw new Error('expected the second workspace local branch to match origin/main before switching workspaces')
  }

  await Workspace.setPath(secondWorkspaceDir)

  await waitForGitRef(FileSystem, secondWorkspaceGitDir, 'refs/remotes/origin/main', upstreamHead)
  const localHeadAfterSwitch = await readGitRef(FileSystem, secondWorkspaceGitDir, 'refs/heads/main')
  if (localHeadAfterSwitch !== localHeadBeforeSwitch) {
    throw new Error('expected automatic fetch not to move the second workspace local branch')
  }
  const fetchHead = await FileSystem.readFile(`${secondWorkspaceGitDir}/FETCH_HEAD`)
  if (!fetchHead.startsWith(upstreamHead.trim())) {
    throw new Error(`expected FETCH_HEAD to start with ${upstreamHead.trim()}, got ${fetchHead}`)
  }
}
