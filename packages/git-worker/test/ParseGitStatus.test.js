import * as ParseGitStatus from '../src/parts/ParseGitStatus/ParseGitStatus.js'
import * as FileStateType from '../../extension/src/parts/FileStateType/FileStateType.js'

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

test('parseLines - both deleted', () => {
  const stdout = `DD index.js
UA index2.js
AU new-file.js`
  const lines = stdout.split('\n')
  expect(ParseGitStatus.parseLines(lines)).toEqual([
    {
      file: 'index.js',
      status: FileStateType.BothDeleted,
    },
    {
      file: 'index2.js',
      status: FileStateType.AddedByThem,
    },
    {
      file: 'new-file.js',
      status: FileStateType.AddedByUs,
    },
  ])
})

test('parseLines - both added', () => {
  const stdout = `AA index.js`
  const lines = stdout.split('\n')
  expect(ParseGitStatus.parseLines(lines)).toEqual([
    {
      file: 'index.js',
      status: FileStateType.BothAdded,
    },
  ])
})

test('parseLines - deleted by us', () => {
  const stdout = `DU index.js`
  const lines = stdout.split('\n')
  expect(ParseGitStatus.parseLines(lines)).toEqual([
    {
      file: 'index.js',
      status: FileStateType.DeletedByUs,
    },
  ])
})

test('parseLines - deleted by them', () => {
  const stdout = `UD index.js`
  const lines = stdout.split('\n')
  expect(ParseGitStatus.parseLines(lines)).toEqual([
    {
      file: 'index.js',
      status: FileStateType.DeletedByThem,
    },
  ])
})
