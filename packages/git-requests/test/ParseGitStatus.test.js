import * as ParseGitStatus from '../src/parts/ParseGitStatus/ParseGitStatus.js'
import * as FileStateType from '../src/parts/FileStateType/FileStateType.js'

test('parseLines', () => {
  const stdout = ` M extensions/builtin.git/src/parts/GitRequestsGetModifiedFiles/GitRequestsGetModifiedFiles.js
 M packages/extension-host/src/parts/InternalCommand/InternalCommand.js`
  const lines = stdout.split('\n')
  expect(ParseGitStatus.parseGitStatus(lines)).toEqual([
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
  expect(ParseGitStatus.parseGitStatus(lines)).toEqual([
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
  expect(ParseGitStatus.parseGitStatus(lines)).toEqual([
    {
      file: 'index.js',
      status: FileStateType.BothAdded,
    },
  ])
})

test('parseLines - deleted by us', () => {
  const stdout = `DU index.js`
  const lines = stdout.split('\n')
  expect(ParseGitStatus.parseGitStatus(lines)).toEqual([
    {
      file: 'index.js',
      status: FileStateType.DeletedByUs,
    },
  ])
})

test('parseLines - deleted by them', () => {
  const stdout = `UD index.js`
  const lines = stdout.split('\n')
  expect(ParseGitStatus.parseGitStatus(lines)).toEqual([
    {
      file: 'index.js',
      status: FileStateType.DeletedByThem,
    },
  ])
})

test('parseLines - y - modified', () => {
  const stdout = ` M index.js`
  const lines = stdout.split('\n')
  expect(ParseGitStatus.parseGitStatus(lines)).toEqual([
    {
      file: 'index.js',
      status: FileStateType.Modified,
    },
  ])
})

test('parseLines - y - deleted', () => {
  const stdout = ` D index.js`
  const lines = stdout.split('\n')
  expect(ParseGitStatus.parseGitStatus(lines)).toEqual([
    {
      file: 'index.js',
      status: FileStateType.Deleted,
    },
  ])
})

test('parseLines - y - added', () => {
  const stdout = ` A index.js`
  const lines = stdout.split('\n')
  expect(ParseGitStatus.parseGitStatus(lines)).toEqual([
    {
      file: 'index.js',
      status: FileStateType.IntentToAdd,
    },
  ])
})

test('parseLines - y - renamed', () => {
  const stdout = ` R index.js`
  const lines = stdout.split('\n')
  expect(ParseGitStatus.parseGitStatus(lines)).toEqual([
    {
      file: 'index.js',
      status: FileStateType.IntentToRename,
    },
  ])
})

test('parseLines - y - type changed', () => {
  const stdout = ` T index.js`
  const lines = stdout.split('\n')
  expect(ParseGitStatus.parseGitStatus(lines)).toEqual([
    {
      file: 'index.js',
      status: FileStateType.TypeChanged,
    },
  ])
})

test('parseLines - x - deleted', () => {
  const stdout = `D  static/objects.json`
  const lines = stdout.split('\n')
  expect(ParseGitStatus.parseGitStatus(lines)).toEqual([
    {
      file: 'static/objects.json',
      status: FileStateType.IndexDeleted,
    },
  ])
})

test('parseLines - r - staged and renamed', () => {
  const stdout = 'R  index.ts\u0000index.js\u0000'
  const lines = stdout.split('\n')
  expect(ParseGitStatus.parseGitStatus(lines)).toEqual([
    {
      file: 'index.ts',
      status: FileStateType.IndexRenamed,
    },
  ])
})

test('parseLines - deleted and updated', () => {
  const stdout = ' D index.js\u0000?? index.ts\u0000'
  const lines = stdout.split('\n')
  expect(ParseGitStatus.parseGitStatus(lines)).toEqual([
    {
      file: 'index.ts',
      status: FileStateType.IndexRenamed,
    },
  ])
})
