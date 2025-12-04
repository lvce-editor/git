import { testWorker } from '../src/testWorker.js'

test('git add all', async () => {
  const execMap = {
    restore: {
      exitCode: 0,
      stderr: '',
      stdout: '',
    },
  }
  const config = {
    confirmDiscard: false,
  }
  const worker = await testWorker({
    config,
    execMap,
  })
  await worker.execute('Git.discard', { cwd: '', file: '/test/file.txt', gitPath: 'git' })
  expect(worker.invocations).toEqual([
    ['Config.getGitPaths'],
    ['Exec.exec', 'git', ['--version'], {}],
    ['Config.getWorkspaceFolder'],
    ['Config.confirmDiscard'],
    [
      'Exec.exec',
      'git',
      ['restore', '--', '/test/file.txt'],
      {
        cwd: '/test',
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
