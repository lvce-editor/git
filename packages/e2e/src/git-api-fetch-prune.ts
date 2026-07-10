import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.fetchPrune'

const refExists = async (
  FileSystem: {
    readDir(path: string): Promise<readonly { readonly name: string }[]>
    readFile(path: string): Promise<string>
  },
  gitDir: string,
  refName: string,
): Promise<boolean> => {
  const segments = refName.split('/')
  const fileName = segments.at(-1)
  const parentDir = `${gitDir}/${segments.slice(0, -1).join('/')}`
  if (fileName) {
    try {
      const entries = await FileSystem.readDir(parentDir)
      if (entries.some((entry) => entry.name === fileName)) {
        return true
      }
    } catch {
      // The parent directory may not exist when refs are fully packed.
    }
  }
  try {
    const packedRefs = await FileSystem.readFile(`${gitDir}/packed-refs`)
    return packedRefs.split('\n').some((line) => line.endsWith(` ${refName}`))
  } catch {
    return false
  }
}

export const test: Test = async ({ Command, FileSystem, Git, Settings, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const workspaceDir = `${tmpDir}/workspace`
  const workspaceGitDir = `${workspaceDir}/.git`

  await Workspace.setPath(tmpDir)
  await Settings.update({
    'git.path': '/usr/bin/git',
  })
  const fixtureUrl = import.meta.resolve('../fixtures/git-api-fetch-prune')
  await Command.execute('ExtensionHost.executeCommand', 'git.loadFixture', fixtureUrl)
  await Workspace.setPath(workspaceDir)

  const hadFeatureRefBeforeFetch = await refExists(FileSystem, workspaceGitDir, 'refs/remotes/origin/feature')
  if (!hadFeatureRefBeforeFetch) {
    throw new Error('expected refs/remotes/origin/feature to exist before fetch prune')
  }

  // act
  await Git.fetchPrune()

  // assert
  const hasFeatureRefAfterFetch = await refExists(FileSystem, workspaceGitDir, 'refs/remotes/origin/feature')
  if (hasFeatureRefAfterFetch) {
    throw new Error('expected refs/remotes/origin/feature to be removed after fetch prune')
  }
  await FileSystem.shouldHaveFile(`${workspaceDir}/file.txt`, 'version 1')
  await Git.shouldHaveInvocations([
    {
      command: ['git', 'fetch', '--all', '--prune'],
      cwd: workspaceDir,
    },
  ])
}
