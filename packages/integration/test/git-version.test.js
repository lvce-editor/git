import { testWorker } from '../src/testWorker.js'

test('git version', async () => {
  const execMap = {
    '--version': {
      stdout: 'git version 2.39.2',
      stderr: '',
      exitCode: 0,
    },
  }
  expect(
    await testWorker({
      execMap,
      command: ['Git.version', { gitPath: '', cwd: '' }],
    }),
  ).toBe('2.39.2')
})
