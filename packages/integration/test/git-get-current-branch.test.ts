import { testWorker } from '../src/testWorker.js'

test('git get current branch', async () => {
  const execMap = {
    '--version': {
      stdout: 'git version 2.39.2',
      stderr: '',
      exitCode: 0,
    },
    branch: {
      stdout: 'main',
      stderr: '',
      exitCode: 0,
    },
  }
  const config = {
    gitPaths: ['git'],
    workspaceFolder: '/test',
  }
  const worker = await testWorker({
    config,
    execMap,
  })
  expect(await worker.execute('Git.getCurrentBranch', { gitPath: '', cwd: '' })).toBe('main')
})
