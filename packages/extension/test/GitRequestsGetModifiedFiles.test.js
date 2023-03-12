import * as FileStateType from '../src/parts/FileStateType/FileStateType.js'
import { jest } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/Exec/Exec.js', () => {
  return {
    exec: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

const GitRequestsGetModifiedFiles = await import(
  '../src/parts/GitRequestsGetModifiedFiles/GitRequestsGetModifiedFiles.js'
)
const Exec = await import('../src/parts/Exec/Exec.js')

// TODO mock exec instead

class ExecError extends Error {
  constructor(stderr) {
    super('')
    this.stderr = stderr
  }
}

test('getModifiedFiles', async () => {
  // @ts-ignore
  Exec.exec.mockImplementation(() => {
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
    index: [
      {
        file: 'extensions/builtin.git/src/parts/GitRequestsGetModifiedFiles/GitRequestsGetModifiedFiles.js',
        status: FileStateType.Modified,
      },
      {
        file: 'packages/extension-host/src/parts/InternalCommand/InternalCommand.js',
        status: FileStateType.Modified,
      },
    ],
  })
})

test('getModifiedFiles - error - unknown git error', async () => {
  // @ts-ignore
  Exec.exec.mockImplementation(() => {
    throw new ExecError('oops')
  })
  await expect(
    GitRequestsGetModifiedFiles.getModifiedFiles({
      cwd: '',
      gitPath: '',
    })
  ).rejects.toThrowError(new Error('Git: oops'))
})
