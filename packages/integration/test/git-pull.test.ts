import { testWorker } from '../src/testWorker.js'

test('git init', async () => {
  const execMap = {
    pull: {
      stdout: '',
      stderr: '',
      exitCode: 0,
    },
    '--version': {
      stdout: 'git version 2.39.2',
      stderr: '',
      exitCode: 0,
    },
  }
  const config = {
    gitPaths: ['git'],
    workspaceFolder: '/test',
  }
  const worker = await testWorker({
    execMap,
    config,
  })
  await worker.execute('Git.pull', { gitPath: 'git', cwd: '' })
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
