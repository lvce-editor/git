import * as GitRequestsAddRemote from '../src/parts/GitRequestsAddRemote/GitRequestsAddRemote.js'

class ExecError extends Error {
  constructor(stderr) {
    super('')
    // @ts-ignore
    this.stderr = stderr
  }
}

test('addRemote - error - unknown git error', async () => {
  const exec = (): never => {
    throw new ExecError('oops')
  }
  await expect(
    GitRequestsAddRemote.addRemote({
      cwd: '/test/test-folder',
      exec,
      gitPath: 'git',
      name: 'origin',
      url: '/test/remote.git',
    }),
  ).rejects.toThrow(new Error('Git: oops'))
})
