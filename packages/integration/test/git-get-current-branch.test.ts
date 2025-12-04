import { testWorker } from '../src/testWorker.js'

test('git get current branch', async () => {
  const execMap = {
    branch: {
      exitCode: 0,
      stderr: '',
      stdout: 'main',
    },
  }
  const config = {}
  const worker = await testWorker({
    config,
    execMap,
  })
  expect(await worker.execute('Git.getCurrentBranch', { cwd: '', gitPath: '' })).toBe('main')
})
