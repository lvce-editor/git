import { jest } from '@jest/globals'
import * as Exec from '../src/parts/Exec/Exec.js'
import * as GitRequestsGetModifiedFiles from '../src/parts/GitRequestsGetModifiedFiles/GitRequestsGetModifiedFiles.js'

class ExecError extends Error {
  constructor(stderr) {
    super('')
    this.stderr = stderr
  }
}

test('getModifiedFiles', async () => {
  Exec.state.exec = jest.fn(async () => {
    return {
      stdout: ` M extensions/builtin.git/src/parts/GitRequestsGetModifiedFiles/GitRequestsGetModifiedFiles.js
 M packages/extension-host/src/parts/InternalCommand/InternalCommand.js`,
      stderr: '',
      exitCode: 0,
    }
  })
  expect(
    await GitRequestsGetModifiedFiles.getModifiedFiles({
      cwd: '',
      gitPath: '',
    })
  ).toEqual({
    count: 2,
    gitRoot: '',
    index: [],
    merge: [],
    untracked: [],
    workingTree: [
      {
        file: 'extensions/builtin.git/src/parts/GitRequestsGetModifiedFiles/GitRequestsGetModifiedFiles.js',
        status: 1,
      },
      {
        file: 'packages/extension-host/src/parts/InternalCommand/InternalCommand.js',
        status: 1,
      },
    ],
  })
})

test('getModifiedFiles - error - unknown git error', async () => {
  Exec.state.exec = jest.fn(async () => {
    throw new ExecError('oops')
  })
  await expect(
    GitRequestsGetModifiedFiles.getModifiedFiles({
      cwd: '',
      gitPath: '',
    })
  ).rejects.toThrowError(new Error('Git: oops'))
})
