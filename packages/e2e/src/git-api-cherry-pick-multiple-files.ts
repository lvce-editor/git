import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.cherry-pick-multiple-files'

type GitCommit = {
  readonly message: string
}

export const test: Test = async ({ Command, FileSystem, Git, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })

  await Workspace.setPath(tmpDir)
  await Git.init({ initialBranch: 'main' })
  await Git.setConfig('user.name', 'Test User')
  await Git.setConfig('user.email', 'test@example.com')
  await FileSystem.writeFile(`${tmpDir}/base.txt`, 'base')
  await Git.add('base.txt')
  await Git.commit('base')
  await Git.branch('feature')
  await Git.checkout('feature')
  await FileSystem.setFiles([
    { content: 'first', uri: `${tmpDir}/first.txt` },
    { content: 'second', uri: `${tmpDir}/second.txt` },
  ])
  await Git.addAll()
  await Git.commit('add two files')
  const featureRefRaw = await FileSystem.readFile(`${tmpDir}/.git/refs/heads/feature`)
  const featureRef = featureRefRaw.trim()
  await Git.checkout('main')

  await Git.cherryPick(featureRef)

  await FileSystem.shouldHaveFile(`${tmpDir}/first.txt`, 'first')
  await FileSystem.shouldHaveFile(`${tmpDir}/second.txt`, 'second')
  const commits = (await Command.execute('ExtensionHost.executeCommand', 'git.getCommits')) as readonly GitCommit[]
  if (commits[0]?.message !== 'add two files') {
    throw new Error(`expected cherry-picked commit, got ${JSON.stringify(commits)}`)
  }
}
