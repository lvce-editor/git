import { test, expect } from '@jest/globals'
import { join } from '../src/Path/Path.ts'

test('join with multiple segments', () => {
  expect(join('a', 'b', 'c')).toBe('a/b/c')
})

test('join with empty segments', () => {
  expect(join('a', '', 'c')).toBe('a/c')
})

test('join with single segment', () => {
  expect(join('a')).toBe('a')
})

test('join with no segments', () => {
  expect(join()).toBe('')
})

test('join with leading slash', () => {
  expect(join('/', 'a', 'b')).toBe('/a/b')
})

test('join with trailing slash', () => {
  expect(join('a', 'b', '/')).toBe('a/b/')
})

test('join with multiple slashes', () => {
  expect(join('a//b', '//c')).toBe('a/b/c')
})

test('join with absolute path', () => {
  expect(join('/usr', 'local', 'bin')).toBe('/usr/local/bin')
})

test('join with relative path', () => {
  expect(join('..', 'parent', 'file.txt')).toBe('../parent/file.txt')
})

test('join with mixed separators', () => {
  expect(join(String.raw`a\b`, 'c/d', 'e')).toBe(String.raw`a\b/c/d/e`)
})
