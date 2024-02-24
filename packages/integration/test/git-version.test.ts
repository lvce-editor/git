import { testWorker } from '../src/testWorker.js'

test('git version', async () => {
  const execMap = {
    '--version': {
      stdout: 'git version 2.39.2',
      stderr: '',
      exitCode: 0,
    },
  }
  const config = {
    gitPaths: ['git'],
    workspaceFolder: '/test',
  }
  const worker = await testWorker({
    execMap,
    config,
  })
  expect(await worker.execute('Git.version', { gitPath: '', cwd: '' })).toBe('2.39.2')
})

test('git version - fatal unterminated line', async () => {
  const execMap = {
    '--version': {
      stdout: '',
      stderr: 'fatal: unterminated line in .git/packed-refs: 17171717171717171717171717171717171717',
      exitCode: 1,
    },
  }
  const config = {
    gitPaths: ['git'],
    workspaceFolder: '/test',
  }
  const worker = await testWorker({
    execMap,
    config,
  })
  await expect(worker.execute('Git.version', { gitPath: '', cwd: '' })).rejects.toThrow(
    new Error(`Git: fatal: unterminated line in .git/packed-refs: 17171717171717171717171717171717171717`),
  )
})
