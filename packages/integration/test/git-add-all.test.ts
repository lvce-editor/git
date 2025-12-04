import { testWorker } from '../src/testWorker.js'

test('git add all', async () => {
  const execMap = {
    add: {
      exitCode: 0,
      stderr: '',
      stdout: '',
    },
  }
  const config = {}
  const worker = await testWorker({
    config,
    execMap,
  })
  await worker.execute('Git.addAll', { cwd: '', gitPath: 'git' })
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
