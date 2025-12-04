import { testWorker } from '../src/testWorker.js'

test('git unstage all - error - could not resolve head', async () => {
  const execMap = {
    reset: {
      exitCode: 0,
      stderr: '',
      stdout: '',
    },
    restore: {
      exitCode: 128,
      stderr: 'fatal: could not resolve HEAD',
      stdout: '',
    },
  }
  const config = {}
  const worker = await testWorker({
    config,
    execMap,
  })
  await worker.execute('Git.unstageAll', { cwd: '', gitPath: 'git' })
  const env = {
    GIT_OPTIONAL_LOCKS: '0',
    LANG: 'en_US.UTF-8',
    LC_ALL: 'en_US',
  }
  expect(worker.invocations).toEqual([
    ['Config.getGitPaths'],
    ['Exec.exec', 'git', ['--version'], {}],
    ['Config.getWorkspaceFolder'],
    [
      'Exec.exec',
      'git',
      ['restore', '--staged', '.'],
      {
        cwd: '/test',
        env,
        reject: false,
      },
    ],
    [
      'Exec.exec',
      'git',
      ['reset', '.'],
      {
        cwd: '/test',
        env,
        reject: false,
      },
    ],
  ])
})
