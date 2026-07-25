import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.init-existing-repository'

type GitCommit = {
  readonly message: string
}

export const test: Test = async ({ Command, FileSystem, Git, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })

  await Workspace.setPath(tmpDir)
  await Git.init({ initialBranch: 'main' })
  await Git.setConfig('user.name', 'Test User')
  await Git.setConfig('user.email', 'test@example.com')
  await FileSystem.writeFile(`${tmpDir}/file.txt`, 'content')
  await Git.add('file.txt')
  await Git.commit('initial')
  const headBefore = await FileSystem.readFile(`${tmpDir}/.git/refs/heads/main`)

  await Git.init()

  await FileSystem.shouldHaveFile(`${tmpDir}/.git/refs/heads/main`, headBefore)
  const commits = (await Command.execute('ExtensionHost.executeCommand', 'git.getCommits')) as readonly GitCommit[]
  if (commits.length !== 1 || commits[0].message !== 'initial') {
    throw new Error(`expected existing commit to be preserved, got ${JSON.stringify(commits)}`)
  }
}
