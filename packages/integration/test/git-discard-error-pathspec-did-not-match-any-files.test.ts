import { testWorker } from '../src/testWorker.js'

test('git discard - error pathspec did not match any files', async () => {
  const execMap = {
    '--version': {
      stdout: 'git version 2.39.2',
      stderr: '',
      exitCode: 0,
    },
    add: {
      stdout: '',
      stderr: '',
      exitCode: 0,
    },
    restore: {
      stdout: '',
      stderr: "error: pathspec 'index.html' did not match any file(s) known to git",
      exitCode: 1,
    },
  }
  const config = {
    gitPaths: ['git'],
    workspaceFolder: '/test',
    confirmDiscard: false,
  }
  const worker = await testWorker({
    execMap,
    config,
  })
  await expect(worker.execute('Git.discard', { gitPath: 'git', cwd: '', file: '/test/index.html' })).rejects.toThrow(
    new Error("Git: error: pathspec 'index.html' did not match any file(s) known to git"),
  )
  expect(worker.invocations).toEqual([
    ['Config.getGitPaths'],
    ['Exec.exec', 'git', ['--version'], {}],
    ['Config.getWorkspaceFolder'],
    ['Config.confirmDiscard'],
    [
      'Exec.exec',
      'git',
      ['restore', '--', '/test/index.html'],
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
