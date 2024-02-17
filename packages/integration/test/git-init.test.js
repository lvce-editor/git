import { testWorker } from '../src/testWorker.js'

test('git init', async () => {
  const execMap = {
    init: {
      stdout: '',
      stderr: '',
      exitCode: 0,
    },
  }
  const worker = await testWorker({
    execMap,
  })
  await worker.execute('Git.init', { gitPath: 'git', cwd: '' })
  expect(worker.invocations).toEqual([
    [
      'Exec.exec',
      'git',
      ['init'],
      {
        cwd: '',
        env: {
          GIT_OPTIONAL_LOCKS: '0',
          LANG: 'en_US.UTF-8',
          LC_ALL: 'en_US',
        },
        reject: false,
      },
    ],
  ])
})
