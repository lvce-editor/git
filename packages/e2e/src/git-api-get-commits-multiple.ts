import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.get-commits-multiple'

type GitCommit = {
  readonly message: string
}

export const test: Test = async ({ Command, FileSystem, Git, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const fileName = 'file.txt'

  await Workspace.setPath(tmpDir)
  await Git.init()
  await Git.setConfig('user.name', 'Test User')
  await Git.setConfig('user.email', 'test@example.com')
  await FileSystem.writeFile(`${tmpDir}/${fileName}`, 'first')
  await Git.add(fileName)
  await Git.commit('first')
  await FileSystem.writeFile(`${tmpDir}/${fileName}`, 'second')
  await Git.add(fileName)
  await Git.commit('second')
  await FileSystem.writeFile(`${tmpDir}/${fileName}`, 'third')
  await Git.add(fileName)
  await Git.commit('third')

  const commits = (await Command.execute('ExtensionHost.executeCommand', 'git.getCommits')) as readonly GitCommit[]

  const messages = commits.map((commit) => commit.message)
  if (JSON.stringify(messages) !== JSON.stringify(['third', 'second', 'first'])) {
    throw new Error(`expected reverse chronological commits, got ${JSON.stringify(messages)}`)
  }
}
