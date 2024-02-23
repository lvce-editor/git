import { testWorker } from '../src/testWorker.js'

test('git add all', async () => {
  const execMap = {
    add: {
      stdout: '',
      stderr: '',
      exitCode: 0,
    },
  }
  const worker = await testWorker({
    execMap,
  })
  await worker.execute('Git.addAll', { gitPath: 'git', cwd: '' })
  expect(worker.invocations).toEqual([
    [
      'Exec.exec',
      'git',
      ['add', '.'],
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
