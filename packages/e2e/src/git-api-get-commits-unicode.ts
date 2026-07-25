import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.get-commits-unicode'

type GitCommit = {
  readonly message: string
}

export const test: Test = async ({ Command, FileSystem, Git, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const message = '更新 résumé'

  await Workspace.setPath(tmpDir)
  await Git.init()
  await Git.setConfig('user.name', 'Test User')
  await Git.setConfig('user.email', 'test@example.com')
  await FileSystem.writeFile(`${tmpDir}/file.txt`, 'content')
  await Git.add('file.txt')
  await Git.commit(message)

  const commits = (await Command.execute('ExtensionHost.executeCommand', 'git.getCommits')) as readonly GitCommit[]

  if (commits.length !== 1 || commits[0].message !== message) {
    throw new Error(`expected unicode commit message, got ${JSON.stringify(commits)}`)
  }
}
