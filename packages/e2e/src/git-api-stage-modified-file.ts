import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.stage-modified-file'

type GitCommit = {
  readonly message: string
}

export const test: Test = async ({ Command, FileSystem, Git, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const fileName = 'modified.txt'

  await Workspace.setPath(tmpDir)
  await Git.init()
  await Git.setConfig('user.name', 'Test User')
  await Git.setConfig('user.email', 'test@example.com')
  await FileSystem.writeFile(`${tmpDir}/${fileName}`, 'before')
  await Git.add(fileName)
  await Git.commit('initial')
  await FileSystem.writeFile(`${tmpDir}/${fileName}`, 'after')

  await Git.stage(fileName)
  await Git.commit('update')

  const commits = (await Command.execute('ExtensionHost.executeCommand', 'git.getCommits')) as readonly GitCommit[]
  if (commits[0]?.message !== 'update') {
    throw new Error(`expected update commit, got ${JSON.stringify(commits)}`)
  }
  await FileSystem.shouldHaveFile(`${tmpDir}/${fileName}`, 'after')
}
