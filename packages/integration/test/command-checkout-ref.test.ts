import { testWorker } from '../src/testWorker.js'

test('command checkout ref', async () => {
  const execMap = {
    '--version': {
      exitCode: 0,
      stderr: '',
      stdout: 'git version 2.39.2',
    },
    checkout: {
      exitCode: 0,
      stderr: '',
      stdout: '',
    },
    'for-each-ref': {
      exitCode: 0,
      stderr: '',
      stdout: [
        `refs/heads/b f63b3b1b60166f6f3a99e5de7867cc2ae29b9c92 `,
        `refs/heads/main a205f65eaeedfcc0bae56de354220df552d44a52 `,
        `refs/remotes/origin/b f63b3b1b60166f6f3a99e5de7867cc2ae29b9c92 `,
        `refs/remotes/origin/main a205f65eaeedfcc0bae56de354220df552d44a52 `,
      ].join('\n'),
    },
  }
  const config = {
    gitPaths: ['git'],
    workspaceFolder: '/test',
  }
  const quickPick = () => {
    return 'b'
  }
  const worker = await testWorker({
    config,
    execMap,
    quickPick,
  })
  await worker.execute('Command.gitCheckoutRef', { cwd: '', gitPath: 'git' })
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
    [
      'QuickPick.show',
      [
        {
          description: 'f63b3b1b',
          icon: 1,
          label: 'b',
        },
        {
          description: 'a205f65e',
          icon: 1,
          label: 'main',
        },
        {
          description: 'f63b3b1b',
          icon: 2,
          label: 'origin/b',
        },
        {
          description: 'a205f65e',
          icon: 2,
          label: 'origin/main',
        },
      ],
    ],
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
