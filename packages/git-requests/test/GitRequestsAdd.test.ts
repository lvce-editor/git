import * as GitRequestsAdd from '../src/parts/GitRequestsAdd/GitRequestsAdd.js'

class ExecError extends Error {
  constructor(stderr) {
    super('')
    // @ts-ignore
    this.stderr = stderr
  }
}

test('add - error - not a git repository', async (): Promise<void> => {
  // @ts-ignore
  const exec = (): never => {
    throw new ExecError('fatal: not a git repository')
  }
  await expect(
    GitRequestsAdd.add({
      cwd: '',
      exec,
      file: '.',
      gitPath: '',
    }),
  ).rejects.toThrow(new Error('Git: fatal: not a git repository'))
})

test('add - error - unknown git error', async (): Promise<void> => {
  // @ts-ignore
  const exec = (): never => {
    throw new ExecError('oops')
  }
  await expect(
    GitRequestsAdd.add({
      cwd: '/test/test-folder',
      exec,
      file: '.',
      gitPath: '',
    }),
  ).rejects.toThrow(new Error('Git: oops'))
})
