import { testWorker } from '../src/testWorker.js'

test('git discard - error pathspec did not match any files', async () => {
  const execMap = {
    restore: {
      stdout: '',
      stderr: "error: pathspec 'index.html' did not match any file(s) known to git",
      exitCode: 1,
    },
  }
  const config = {
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
