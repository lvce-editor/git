import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.commit'

// export const skip = true

// @ts-ignore
export const test: Test = async ({ Command, expect, FileSystem, Git, KeyBoard, Locator, Settings, SideBar, SourceControl, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  await Workspace.setPath(tmpDir)
  await FileSystem.writeFile(`${tmpDir}/file`, 'content')
  await Git.init()
  await Git.setConfig('user.name', 'Test User')
  await Git.setConfig('user.email', 'test@example.com')
  await Git.add('.')

  // act
  await Git.commit('First commit')

  // assert
  // @ts-ignore
  // await Git.shouldHaveCommit('First commit')

  // @ts-ignore
  await Git.shouldHaveInvocations([
    {
      command: ['git', 'init'],
      cwd: tmpDir,
    },
    {
      command: ['git', 'commit', '-m', 'First commit'],
      cwd: tmpDir,
    },
  ])
}
