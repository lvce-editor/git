import * as GitRequestsMerge from '../src/parts/GitRequestsMerge/GitRequestsMerge.js'

class ExecError extends Error {
  constructor(stderr) {
    super('')
    // @ts-ignore
    this.stderr = stderr
  }
}

test('merge - passes ref argument', async () => {
  const exec = jest.fn()
  await GitRequestsMerge.merge({
    cwd: '/test/test-folder',
    exec,
    gitPath: 'git',
    ref: 'other/main',
  })
  expect(exec).toHaveBeenCalledTimes(1)
  expect(exec).toHaveBeenCalledWith({
    args: ['merge', 'other/main'],
    cwd: '/test/test-folder',
    gitPath: 'git',
    name: 'merge',
  })
})

test('merge - error - unknown git error', async (): Promise<void> => {
  const exec = (): never => {
    throw new ExecError('oops')
  }
  await expect(
    GitRequestsMerge.merge({
      cwd: '/test/test-folder',
      exec,
      gitPath: '',
      ref: 'other/main',
    }),
  ).rejects.toThrow(new Error('Git: oops'))
})
