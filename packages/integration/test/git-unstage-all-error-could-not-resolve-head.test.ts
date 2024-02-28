import { testWorker } from '../src/testWorker.js'

test('git unstage all - error - could not resolve head', async () => {
  const execMap = {
    restore: {
      stdout: '',
      stderr: 'fatal: could not resolve HEAD',
      exitCode: 128,
    },
  }
  const config = {}
  const worker = await testWorker({
    execMap,
    config,
  })
  await expect(worker.execute('Git.unstageAll', { gitPath: 'git', cwd: '' })).rejects.toThrow(new Error(`Git: fatal: could not resolve HEAD`))
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
