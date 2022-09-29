import { jest } from '@jest/globals'
import * as Exec from '../src/parts/Exec/Exec.js'
import * as GitRequestsTag from '../src/parts/GitRequestsTag/GitRequestsTag.js'

class ExecError extends Error {
  constructor(stderr) {
    super('')
    this.stderr = stderr
  }
}

test('tag - error - tag already exists', async () => {
  Exec.state.exec = jest.fn(async (command, args) => {
    throw new ExecError(`fatal: tag 'abc' already exists`)
  })
  await expect(
    GitRequestsTag.tag({
      tag: 'v0.1',
      cwd: '/test/test-folder',
      gitPath: '',
    })
  ).rejects.toThrowError(new Error("Git: fatal: tag 'abc' already exists"))
})
