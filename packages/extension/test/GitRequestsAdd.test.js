import { jest } from '@jest/globals'
import * as Exec from '../src/parts/Exec/Exec.js'
import * as GitRequestsAdd from '../src/parts/GitRequestsAdd/GitRequestsAdd.js'

class ExecError extends Error {
  constructor(stderr) {
    super('')
    this.stderr = stderr
  }
}

test('add - error - not a git repository', async () => {
  Exec.state.exec = jest.fn(async () => {
    throw new ExecError('fatal: not a git repository')
  })
  await expect(
    GitRequestsAdd.add({
      cwd: '',
      file: '.',
      gitPath: '',
    })
  ).rejects.toThrowError(new Error('Git: fatal: not a git repository'))
})

test('add - error - unknown git error', async () => {
  Exec.state.exec = jest.fn(async () => {
    throw new ExecError('oops')
  })
  await expect(
    GitRequestsAdd.add({
      cwd: '/test/test-folder',
      file: '.',
      gitPath: '',
    })
  ).rejects.toThrowError(new Error('Git: oops'))
})
