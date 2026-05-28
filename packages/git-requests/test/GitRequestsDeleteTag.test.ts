import * as GitRequestsDeleteTag from '../src/parts/GitRequestsDeleteTag/GitRequestsDeleteTag.js'

class ExecError extends Error {
  constructor(stderr) {
    super('')
    // @ts-ignore
    this.stderr = stderr
  }
}

test('deleteTag - error - tag does not exist', async (): Promise<void> => {
  const exec = (): never => {
    throw new ExecError(`error: tag 'v0.1' not found.`)
  }
  await expect(
    GitRequestsDeleteTag.deleteTag({
      cwd: '/test/test-folder',
      exec,
      gitPath: '',
      tag: 'v0.1',
    }),
  ).rejects.toThrow(new Error("Git: error: tag 'v0.1' not found."))
})
