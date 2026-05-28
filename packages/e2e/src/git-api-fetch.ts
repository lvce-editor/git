import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.fetch'

export const skip = 1

export const test: Test = async ({ Command, FileSystem, Git, Settings, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const workspaceDir = `${tmpDir}/workspace`
  const localHeadPath = `${workspaceDir}/.git/refs/remotes/origin/main`
  const upstreamHeadPath = `${tmpDir}/upstream/.git/refs/heads/main`

  await Workspace.setPath(tmpDir)
  await Settings.update({
    'git.path': '/usr/bin/git',
  })
  const fixtureUrl = import.meta.resolve('../fixtures/git-api-fetch')
  await Command.execute('ExtensionHost.executeCommand', 'git.loadFixture', fixtureUrl)
  await Workspace.setPath(workspaceDir)

  const localHeadBeforeFetch = await FileSystem.readFile(localHeadPath)
  const upstreamHeadBeforeFetch = await FileSystem.readFile(upstreamHeadPath)
  if (localHeadBeforeFetch === upstreamHeadBeforeFetch) {
    throw new Error('expected local remote-tracking ref to be outdated before fetch')
  }

  // act
  await Command.execute('ExtensionHost.executeCommand', 'git.fetch')

  // assert
  await FileSystem.shouldHaveFile(`${workspaceDir}/file.txt`, 'version 1')
  const localHeadAfterFetch = await FileSystem.readFile(localHeadPath)
  const upstreamHeadAfterFetch = await FileSystem.readFile(upstreamHeadPath)
  if (localHeadAfterFetch !== upstreamHeadAfterFetch) {
    throw new Error(`expected fetched origin/main to match upstream HEAD, got ${localHeadAfterFetch}`)
  }
  const fetchHead = await FileSystem.readFile(`${workspaceDir}/.git/FETCH_HEAD`)
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
