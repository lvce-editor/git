import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.commit'

export const skip = true

// @ts-ignore
export const test: Test = async ({ Command, expect, FileSystem, Git, KeyBoard, Locator, Settings, SideBar, SourceControl, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  await Workspace.setPath(tmpDir)
  await FileSystem.writeFile(`${tmpDir}/file`, 'content')
  await Git.add({
    paths: ['.'],
  })

  // act
  await Git.commit({
    message: 'First commit',
  })

  // assert
  // TODO verify somehow that commit was created
  // @ts-ignore
  await Git.shouldHaveInvocations([
    {
      command: ['git', 'init'],
      cwd: tmpDir,
    },
    {
      commit: ['git', 'commit', '-m', 'First commit'],
      cwd: tmpDir,
    },
  ])
}
