import * as GitRequestsVersion from '../src/parts/GitRequestsVersion/GitRequestsVersion.js'

test.skip('version', async () => {
  const exec = () => {
    return {
      stdout: 'git version 2.34.1',
      stderr: '',
    }
  }
  expect(
    await GitRequestsVersion.version({
      cwd: '/test/test-folder',
      gitPath: '',
      exec,
    }),
  ).toBe('2.34.1')
})

test('version - error', async () => {
  const exec = () => {
    throw new TypeError(`x is not a function`)
  }
  await expect(
    GitRequestsVersion.version({
      cwd: '/test/test-folder',
      gitPath: '',
      exec,
    }),
  ).rejects.toThrow(new Error('Git: x is not a function'))
})
