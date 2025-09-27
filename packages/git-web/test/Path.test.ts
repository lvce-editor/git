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
