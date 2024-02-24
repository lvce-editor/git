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
