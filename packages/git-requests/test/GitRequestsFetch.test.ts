import type { GitExec, GitExecOptions, GitExecResult } from '../src/parts/Types/Types.ts'
import * as GitRequestsFetch from '../src/parts/GitRequestsFetch/GitRequestsFetch.js'

class ExecError extends Error {
  constructor(stderr) {
    super('')
    // @ts-ignore
    this.stderr = stderr
  }
}

test('fetch - invokes git fetch --all', async (): Promise<void> => {
  const calls: GitExecOptions[] = []
  const exec: GitExec = async (args): Promise<GitExecResult> => {
    calls.push(args)
    return { stderr: '', stdout: '' }
  }
  await GitRequestsFetch.fetch({
    cwd: '/test/test-folder',
    exec,
    gitPath: '/usr/bin/git',
  })
  expect(calls).toEqual([
    {
      args: ['fetch', '--all'],
      cwd: '/test/test-folder',
      gitPath: '/usr/bin/git',
      name: 'fetch',
    },
  ])
})

test('fetch - error - unknown git error', async (): Promise<void> => {
  const exec = (): never => {
    throw new ExecError('oops')
  }
  await expect(
    GitRequestsFetch.fetch({
      cwd: '/test/test-folder',
      exec,
      gitPath: '',
    }),
  ).rejects.toThrow(new Error('Git: oops'))
})
