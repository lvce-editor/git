import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.merge-conflict'

export const test: Test = async ({ FileSystem, Git, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const fileName = 'file.txt'
  const filePath = `${tmpDir}/${fileName}`
  const resolvedContent = 'main\nfeature\n'

  await Workspace.setPath(tmpDir)
  await Git.init({
    initialBranch: 'main',
  })
  await Git.setConfig('user.name', 'Test User')
  await Git.setConfig('user.email', 'test@example.com')

  await FileSystem.writeFile(filePath, 'base\n')
  await Git.add(fileName)
  await Git.commit('root')

  await Git.branch('feature')
  await Git.checkout('feature')
  await FileSystem.writeFile(filePath, 'feature\n')
  await Git.add(fileName)
  await Git.commit('feature change')

  await Git.checkout('main')
  await FileSystem.writeFile(filePath, 'main\n')
  await Git.add(fileName)
  await Git.commit('main change')

  // act
  let mergeError: unknown = undefined
  try {
    await Git.merge('feature')
  } catch (error) {
    mergeError = error
  }

  // assert
  if (!mergeError) {
    throw new Error('expected merge to fail with a conflict')
  }
  const indexContent = await FileSystem.readFile(`${tmpDir}/.git/index`)
  const unmergedEntryCount = indexContent.split(fileName).length - 1
  if (unmergedEntryCount !== 3) {
    throw new Error(`expected 3 index entries for conflicted ${fileName}, got ${unmergedEntryCount}`)
  }
  const conflictedContent = await FileSystem.readFile(filePath)
  if (!conflictedContent.includes('<<<<<<< HEAD') || !conflictedContent.includes('=======') || !conflictedContent.includes('>>>>>>> feature')) {
    throw new Error(`expected merge conflict markers in ${fileName}, got ${conflictedContent}`)
  }
  await FileSystem.shouldHaveFile(`${tmpDir}/.git/HEAD`, 'ref: refs/heads/main\n')
  await FileSystem.shouldHaveFile(`${tmpDir}/.git/MERGE_HEAD`, `${(await FileSystem.readFile(`${tmpDir}/.git/refs/heads/feature`)).trim()}\n`)

  await FileSystem.writeFile(filePath, resolvedContent)
  await Git.add(fileName)
  await Git.commit('resolve merge conflict')

  await FileSystem.shouldHaveFile(filePath, resolvedContent)
  await Git.shouldHaveInvocations([
    {
      command: ['git', 'init', '--initial-branch', 'main'],
      cwd: tmpDir,
    },
    {
      command: ['git', 'add', fileName],
      cwd: tmpDir,
    },
    {
      command: ['git', 'commit', '-m', 'root'],
      cwd: tmpDir,
    },
    {
      command: ['git', 'branch', 'feature'],
      cwd: tmpDir,
    },
    {
      command: ['git', 'checkout', 'feature'],
      cwd: tmpDir,
    },
    {
      command: ['git', 'add', fileName],
      cwd: tmpDir,
    },
    {
      command: ['git', 'commit', '-m', 'feature change'],
      cwd: tmpDir,
    },
    {
      command: ['git', 'checkout', 'main'],
      cwd: tmpDir,
    },
    {
      command: ['git', 'add', fileName],
      cwd: tmpDir,
    },
    {
      command: ['git', 'commit', '-m', 'main change'],
      cwd: tmpDir,
    },
    {
      command: ['git', 'merge', 'feature'],
      cwd: tmpDir,
    },
    {
      command: ['git', 'add', fileName],
      cwd: tmpDir,
    },
    {
      command: ['git', 'commit', '-m', 'resolve merge conflict'],
      cwd: tmpDir,
    },
  ])
}
