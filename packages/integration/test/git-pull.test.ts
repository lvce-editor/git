import { testWorker } from '../src/testWorker.js'

test('git init', async () => {
  const execMap = {
    pull: {
      stdout: '',
      stderr: '',
      exitCode: 0,
    },
  }
  const worker = await testWorker({
    execMap,
  })
  await worker.execute('Git.pull', { gitPath: 'git', cwd: '' })
  expect(worker.invocations).toEqual([
    [
      'Exec.exec',
      'git',
      ['pull'],
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
