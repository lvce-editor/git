import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.commitStaged'

// export const skip = 1

export const test: Test = async ({ Command, FileSystem, Git, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const stagedFile = 'staged.txt'
  const unstagedFile = 'unstaged.txt'
  await Workspace.setPath(tmpDir)
  await FileSystem.writeFile(`${tmpDir}/${stagedFile}`, 'staged content')
  await FileSystem.writeFile(`${tmpDir}/${unstagedFile}`, 'version 1')
  await Git.init()
  await Git.setConfig('user.name', 'Test User')
  await Git.setConfig('user.email', 'test@example.com')
  await Command.execute('ExtensionHost.executeCommand', 'git.stage', stagedFile)
  await FileSystem.writeFile(`${tmpDir}/${unstagedFile}`, 'version 2')

  // act
  await Command.execute('ExtensionHost.executeCommand', 'git.commitStaged', 'First staged commit')

  // assert
  const indexContent = await FileSystem.readFile(`${tmpDir}/.git/index`)
  if (indexContent.includes(unstagedFile)) {
    throw new Error(`expected only staged files to be committed, but found ${unstagedFile} in index`)
  }
  await FileSystem.shouldHaveFile(`${tmpDir}/${unstagedFile}`, 'version 2')
  await Git.shouldHaveInvocations([
    {
      command: ['git', 'init'],
      cwd: tmpDir,
    },
    {
      command: ['git', 'add', stagedFile],
      cwd: tmpDir,
    },
    {
      command: ['git', 'commit', '-m', 'First staged commit'],
      cwd: tmpDir,
    },
  ])
}
