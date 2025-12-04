import { testWorker } from '../src/testWorker.js'

test('git init', async () => {
  const execMap = {
    pull: {
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
  await worker.execute('Git.pull', { cwd: '', gitPath: 'git' })
  expect(worker.invocations).toEqual([
    ['Config.getGitPaths'],
    ['Exec.exec', 'git', ['--version'], {}],
    ['Config.getWorkspaceFolder'],
    [
      'Exec.exec',
      'git',
      ['pull'],
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
