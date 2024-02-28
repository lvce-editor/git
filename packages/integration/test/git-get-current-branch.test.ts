import { testWorker } from '../src/testWorker.js'

test('git get current branch', async () => {
  const execMap = {
    branch: {
      stdout: 'main',
      stderr: '',
      exitCode: 0,
    },
  }
  const config = {}
  const worker = await testWorker({
    config,
    execMap,
  })
  expect(await worker.execute('Git.getCurrentBranch', { gitPath: '', cwd: '' })).toBe('main')
})
