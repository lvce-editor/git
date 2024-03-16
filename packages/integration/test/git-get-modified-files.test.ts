import { testWorker } from '../src/testWorker.js'

test('git get modified files', async () => {
  const execMap = {
    status: {
      stdout: 'R  index.ts\u0000index.js\u0000',
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
      icon: '/icons/dark/status-renamed.svg',
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
      ['status', '--porcelain', '-z', '-uall'],
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
