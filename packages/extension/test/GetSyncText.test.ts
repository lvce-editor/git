import { expect, test } from '@jest/globals'
import * as GetSyncText from '../src/parts/GetSyncText/GetSyncText.ts'

test('returns an empty string when there are no incoming or outgoing changes', () => {
  expect(GetSyncText.getSyncText(0, 0)).toBe('')
})

test('returns only incoming changes when outgoing changes are zero', () => {
  expect(GetSyncText.getSyncText(1, 0)).toBe('1↓')
})

test('returns only outgoing changes when incoming changes are zero', () => {
  expect(GetSyncText.getSyncText(0, 1)).toBe('1↑')
})

test('returns both incoming and outgoing changes when both are non-zero', () => {
  expect(GetSyncText.getSyncText(1, 2)).toBe('1↓ 2↑')
})
