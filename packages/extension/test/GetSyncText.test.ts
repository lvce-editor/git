import { expect, test } from '@jest/globals'
import * as GetSyncText from '../src/parts/GetSyncText/GetSyncText.ts'

test('returns zero for incoming and outgoing changes when there are no changes', () => {
  expect(GetSyncText.getSyncText(0, 0)).toBe('0↓ 0↑')
})

test('includes outgoing changes when the outgoing count is zero', () => {
  expect(GetSyncText.getSyncText(1, 0)).toBe('1↓ 0↑')
})

test('includes incoming changes when the incoming count is zero', () => {
  expect(GetSyncText.getSyncText(0, 1)).toBe('0↓ 1↑')
})

test('returns both incoming and outgoing changes when both are non-zero', () => {
  expect(GetSyncText.getSyncText(1, 2)).toBe('1↓ 2↑')
})
