import { testWorker } from '../src/testWorker.js'

test('git discard all', async () => {
  const execMap = {
    restore: {
      exitCode: 0,
      stderr: '',
      stdout: '',
    },
  }
  const config = {
    gitPaths: ['git'],
    workspaceFolder: '/test',
  }
  const worker = await testWorker({
    config,
    execMap,
  })
  await worker.execute('Git.cleanAll', { cwd: '', gitPath: 'git' })
  expect(worker.invocations).toEqual([
    ['Config.getGitPaths'],
    ['Exec.exec', 'git', ['--version'], {}],
    ['Config.getWorkspaceFolder'],
    [
      'Exec.exec',
      'git',
      ['restore', '--', '.'],
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
