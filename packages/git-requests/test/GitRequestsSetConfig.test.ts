import * as GitRequestsSetConfig from '../src/parts/GitRequestsSetConfig/GitRequestsSetConfig.js'

class ExecError extends Error {
  constructor(stderr) {
    super('')
    // @ts-ignore
    this.stderr = stderr
  }
}

test('setConfig - error - unknown git error', async () => {
  const exec = () => {
    throw new ExecError('oops')
  }
  await expect(
    GitRequestsSetConfig.setConfig({
      cwd: '/test/test-folder',
      exec,
      gitPath: 'git',
      key: 'user.name',
      value: 'Test User',
    }),
  ).rejects.toThrow(new Error('Git: oops'))
})
