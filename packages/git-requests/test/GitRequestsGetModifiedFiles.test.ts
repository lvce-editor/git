import * as FileStateType from '../src/parts/FileStateType/FileStateType.js'
import * as GitRequestsGetModifiedFiles from '../src/parts/GitRequestsGetModifiedFiles/GitRequestsGetModifiedFiles.js'

// TODO mock exec instead

class ExecError extends Error {
  constructor(stderr) {
    super('')
    // @ts-ignore
    this.stderr = stderr
  }
}

test('getModifiedFiles', async () => {
  const exec = () => {
    return {
      exitCode: 0,
      stderr: '',
      stdout: ` M extensions/builtin.git/src/parts/GitRequestsGetModifiedFiles/GitRequestsGetModifiedFiles.js
 M packages/extension-host/src/parts/InternalCommand/InternalCommand.js`,
    }
  }
  expect(
    await GitRequestsGetModifiedFiles.getModifiedFiles({
      cwd: '',
      exec,
      gitPath: '',
    }),
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
  const exec = () => {
    throw new ExecError('oops')
  }
  await expect(
    GitRequestsGetModifiedFiles.getModifiedFiles({
      cwd: '',
      exec,
      gitPath: '',
    }),
  ).rejects.toThrow(new Error('Git: oops'))
})
