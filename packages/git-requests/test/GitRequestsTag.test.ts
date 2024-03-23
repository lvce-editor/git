import * as GitRequestsTag from '../src/parts/GitRequestsTag/GitRequestsTag.js'

class ExecError extends Error {
  constructor(stderr) {
    super('')
    // @ts-ignore
    this.stderr = stderr
  }
}

test('tag - error - tag already exists', async () => {
  const exec = () => {
    throw new ExecError(`fatal: tag 'abc' already exists`)
  }
  await expect(
    GitRequestsTag.tag({
      tag: 'v0.1',
      cwd: '/test/test-folder',
      gitPath: '',
      exec,
    }),
  ).rejects.toThrow(new Error("Git: fatal: tag 'abc' already exists"))
})
