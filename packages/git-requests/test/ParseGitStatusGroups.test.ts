import * as FileStateType from '../src/parts/FileStateType/FileStateType.js'
import * as ParseGitStatusGroups from '../src/parts/ParseGitStatusGroups/ParseGitStatusGroups.js'

test('parseGitStatusGroups - both added', () => {
  const files = [
    {
      file: 'index.js',
      status: FileStateType.BothAdded,
    },
  ]
  expect(ParseGitStatusGroups.parseGitStatusGroups(files)).toEqual({
    indexGroup: [],
    mergeGroup: [
      {
        file: 'index.js',
        status: 16,
      },
    ],
    untrackedGroup: [],
    workingTreeGroup: [],
  })
})

test('parseGitStatusGroups - both deleted', () => {
  const files = [
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
  ]
  expect(ParseGitStatusGroups.parseGitStatusGroups(files)).toEqual({
    indexGroup: [],
    mergeGroup: [
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
    ],
    untrackedGroup: [],
    workingTreeGroup: [],
  })
})

test('parseGitStatusGroups - unknown status', () => {
  const files = [
    {
      file: 'index.js',
      status: 123,
    },
  ]
  expect(() => ParseGitStatusGroups.parseGitStatusGroups(files)).toThrow(new Error('unexpected file status: 123'))
})
