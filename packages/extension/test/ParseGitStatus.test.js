import * as ParseGitStatus from '../src/parts/ParseGitStatus/ParseGitStatus.js'
import * as FileStateType from '../src/parts/FileStateType/FileStateType.js'

test('parseLines', () => {
  const stdout = ` M extensions/builtin.git/src/parts/GitRequestsGetModifiedFiles/GitRequestsGetModifiedFiles.js
 M packages/extension-host/src/parts/InternalCommand/InternalCommand.js`
  const lines = stdout.split('\n')
  expect(ParseGitStatus.parseLines(lines)).toEqual([
    {
      file: 'extensions/builtin.git/src/parts/GitRequestsGetModifiedFiles/GitRequestsGetModifiedFiles.js',
      status: FileStateType.Modified,
    },
    {
      file: 'packages/extension-host/src/parts/InternalCommand/InternalCommand.js',
      status: FileStateType.Modified,
    },
  ])
})
