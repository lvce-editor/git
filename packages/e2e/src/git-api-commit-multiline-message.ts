import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.commit-multiline-message'

type GitCommit = {
  readonly message: string
}

export const test: Test = async ({ Command, FileSystem, Git, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const message = 'subject line\n\nbody line'

  await Workspace.setPath(tmpDir)
  await Git.init()
  await Git.setConfig('user.name', 'Test User')
  await Git.setConfig('user.email', 'test@example.com')
  await FileSystem.writeFile(`${tmpDir}/file.txt`, 'content')
  await Git.add('file.txt')

  await Git.commit(message)

  const commits = (await Command.execute('ExtensionHost.executeCommand', 'git.getCommits')) as readonly GitCommit[]
  if (commits[0]?.message !== 'subject line') {
    throw new Error(`expected subject line, got ${commits[0]?.message}`)
  }
  await FileSystem.shouldHaveFile(`${tmpDir}/.git/COMMIT_EDITMSG`, `${message}\n`)
}
