import { expect, test } from '@jest/globals'
import { toFileSystemPath } from '../src/parts/ToFileSystemPath/ToFileSystemPath.ts'

test('keeps a filesystem path', () => {
  expect(toFileSystemPath('/workspace/test')).toBe('/workspace/test')
})

test('normalizes a posix file uri', () => {
  expect(toFileSystemPath('file:///workspace/test')).toBe('/workspace/test')
})

test('normalizes a windows file uri', () => {
  expect(toFileSystemPath('file:///C:/workspace/test')).toBe('C:/workspace/test')
})

test('decodes a file uri', () => {
  expect(toFileSystemPath('file:///workspace/test%20folder')).toBe('/workspace/test folder')
})
