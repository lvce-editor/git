import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.commit-special-characters'

type GitCommit = {
  readonly hash: string
  readonly message: string
}

export const test: Test = async ({ Command, FileSystem, Git, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const message = "It's ready: [e2e]"

  await Workspace.setPath(tmpDir)
  await Git.init()
  await Git.setConfig('user.name', 'Test User')
  await Git.setConfig('user.email', 'test@example.com')
  await FileSystem.writeFile(`${tmpDir}/file.txt`, 'content')
  await Git.add('file.txt')

  // act
  await Git.commit(message)

  // assert
  const commits = (await Command.execute('ExtensionHost.executeCommand', 'git.getCommits')) as readonly GitCommit[]
  if (commits.length !== 1 || commits[0].message !== message || !commits[0].hash) {
    throw new Error(`expected commit ${JSON.stringify(message)}, got ${JSON.stringify(commits)}`)
  }
  await Git.shouldHaveInvocations([
    {
      command: ['git', 'commit', '-m', message],
      cwd: tmpDir,
    },
  ])
}
