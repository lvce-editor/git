import { testWorker } from '../src/testWorker.js'

test('git add all', async () => {
  const execMap = {
    add: {
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
  await worker.execute('Git.addAll', { gitPath: 'git', cwd: '' })
  expect(worker.invocations).toEqual([
    ['Config.getGitPaths'],
    ['Exec.exec', 'git', ['--version'], {}],
    ['Config.getWorkspaceFolder'],
    [
      'Exec.exec',
      'git',
      ['add', '.'],
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
