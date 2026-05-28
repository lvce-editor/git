import * as GitRequestsVersion from '../src/parts/GitRequestsVersion/GitRequestsVersion.js'

test.skip('version', async (): Promise<void> => {
  const exec = (): never => {
    return {
      stderr: '',
      stdout: 'git version 2.34.1',
    }
  }
  expect(
    await GitRequestsVersion.version({
      cwd: '/test/test-folder',
      exec,
      gitPath: '',
    }),
  ).toBe('2.34.1')
})

test('version - error', async (): Promise<void> => {
  const exec = (): never => {
    throw new TypeError(`x is not a function`)
  }
  await expect(
    GitRequestsVersion.version({
      cwd: '/test/test-folder',
      exec,
      gitPath: '',
    }),
  ).rejects.toThrow(new Error('Git: x is not a function'))
})
