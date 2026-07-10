import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.fetch'

export const skip = 1

const readGitRef = async (
  FileSystem: {
    readFile(path: string): Promise<string>
  },
  gitDir: string,
  refName: string,
): Promise<string> => {
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

export const test: Test = async ({ Command, FileSystem, Git, Settings, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const workspaceDir = `${tmpDir}/workspace`
  const workspaceGitDir = `${workspaceDir}/.git`
  const upstreamGitDir = `${tmpDir}/upstream/.git`

  await Workspace.setPath(tmpDir)
  await Settings.update({
    'git.path': '/usr/bin/git',
  })
  const fixtureUrl = import.meta.resolve('../fixtures/git-api-fetch')
  await Command.execute('ExtensionHost.executeCommand', 'git.loadFixture', fixtureUrl)
  await Workspace.setPath(workspaceDir)

  const localHeadBeforeFetch = await readGitRef(FileSystem, workspaceGitDir, 'refs/remotes/origin/main')
  const upstreamHeadBeforeFetch = await readGitRef(FileSystem, upstreamGitDir, 'refs/heads/main')
  if (localHeadBeforeFetch === upstreamHeadBeforeFetch) {
    throw new Error('expected local remote-tracking ref to be outdated before fetch')
  }

  // act
  await Command.execute('ExtensionHost.executeCommand', 'git.fetch')

  // assert
  await FileSystem.shouldHaveFile(`${workspaceDir}/file.txt`, 'version 1')
  const localHeadAfterFetch = await readGitRef(FileSystem, workspaceGitDir, 'refs/remotes/origin/main')
  const upstreamHeadAfterFetch = await readGitRef(FileSystem, upstreamGitDir, 'refs/heads/main')
  if (localHeadAfterFetch !== upstreamHeadAfterFetch) {
    throw new Error(`expected fetched origin/main to match upstream HEAD, got ${localHeadAfterFetch}`)
  }
  const fetchHead = await FileSystem.readFile(`${workspaceGitDir}/FETCH_HEAD`)
  if (!fetchHead.startsWith(upstreamHeadAfterFetch.trim())) {
    throw new Error(`expected FETCH_HEAD to start with ${upstreamHeadAfterFetch.trim()}, got ${fetchHead}`)
  }
  await Git.shouldHaveInvocations([
    {
      command: ['git', 'fetch', '--all'],
      cwd: workspaceDir,
    },
  ])
}
