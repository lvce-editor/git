import { testWorker } from '../src/testWorker.js'

test('command checkout ref', async () => {
  const execMap = {
    '--version': {
      stdout: 'git version 2.39.2',
      stderr: '',
      exitCode: 0,
    },
    checkout: {
      stdout: '',
      stderr: '',
      exitCode: 0,
    },
    'for-each-ref': {
      stdout: '',
      stderr: '',
      exitCode: 0,
    },
  }
  const config = {
    gitPaths: ['git'],
    workspaceFolder: '/test',
  }
  const quickPick = (options) => {
    return 'b'
  }
  const worker = await testWorker({
    execMap,
    config,
    quickPick,
  })
  await worker.execute('Command.gitCheckoutRef', { gitPath: 'git', cwd: '' })
  expect(worker.invocations).toEqual([
    ['Config.getGitPaths'],
    ['Exec.exec', 'git', ['--version'], {}],
    ['Config.getWorkspaceFolder'],
    [
      'Exec.exec',
      'git',
      ['for-each-ref', '--format', '%(refname) %(objectname) %(*objectname)'],
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
    ['QuickPick.show', []],
    ['Config.getGitPaths'],
    ['Exec.exec', 'git', ['--version'], {}],
    ['Config.getWorkspaceFolder'],
    [
      'Exec.exec',
      'git',
      ['checkout', undefined],
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
