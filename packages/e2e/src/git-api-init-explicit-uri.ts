import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.init-explicit-uri'

export const test: Test = async ({ FileSystem, Git, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const repositoryDir = `${tmpDir}/repository`

  await Workspace.setPath(tmpDir)
  await FileSystem.mkdir(repositoryDir)

  await Git.init({
    initialBranch: 'trunk',
    uri: repositoryDir,
  })

  await FileSystem.shouldHaveFolder(`${repositoryDir}/.git`)
  await FileSystem.shouldHaveFile(`${repositoryDir}/.git/HEAD`, 'ref: refs/heads/trunk\n')
}
