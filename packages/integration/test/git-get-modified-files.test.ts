import { testWorker } from '../src/testWorker.js'

test('git get modified files', async () => {
  const execMap = {
    status: {
      stdout: 'R  index.js -> index.ts',
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
  expect(await worker.execute('Git.getChangedFiles', { gitPath: 'git', cwd: '' })).toEqual([
    {
      file: 'index.ts',
      icon: 3,
      iconTitle: 'Index Renamed',
      status: 6,
      strikeThrough: false,
    },
  ])
  expect(worker.invocations).toEqual([
    ['Config.getGitPaths'],
    ['Exec.exec', 'git', ['--version'], {}],
    ['Config.getWorkspaceFolder'],
    ['Config.getGitPaths'],
    ['Exec.exec', 'git', ['--version'], {}],
    ['Config.getWorkspaceFolder'],
    [
      'Exec.exec',
      'git',
      ['status', '--porcelain', '-uall'],
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
