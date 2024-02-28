import { testWorker } from '../src/testWorker.js'

test('git init', async () => {
  const execMap = {
    init: {
      stdout: '',
      stderr: '',
      exitCode: 0,
    },
  }
  const config = {}
  const worker = await testWorker({
    execMap,
    config,
  })
  await worker.execute('Git.init', { gitPath: 'git', cwd: '' })
  expect(worker.invocations).toEqual([
    ['Config.getGitPaths'],
    ['Exec.exec', 'git', ['--version'], {}],
    ['Config.getWorkspaceFolder'],
    [
      'Exec.exec',
      'git',
      ['init'],
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
