import * as GitRequestsAdd from '../src/parts/GitRequestsAdd/GitRequestsAdd.js'

class ExecError extends Error {
  constructor(stderr) {
    super('')
    this.stderr = stderr
  }
}

test('add - error - not a git repository', async () => {
  // @ts-ignore
  const exec = () => {
    throw new ExecError('fatal: not a git repository')
  }
  await expect(
    GitRequestsAdd.add({
      cwd: '',
      file: '.',
      gitPath: '',
      exec,
    }),
  ).rejects.toThrow(new Error('Git: fatal: not a git repository'))
})

test('add - error - unknown git error', async () => {
  // @ts-ignore
  const exec = () => {
    throw new ExecError('oops')
  }
  await expect(
    GitRequestsAdd.add({
      cwd: '/test/test-folder',
      file: '.',
      gitPath: '',
      exec,
    }),
  ).rejects.toThrow(new Error('Git: oops'))
})
