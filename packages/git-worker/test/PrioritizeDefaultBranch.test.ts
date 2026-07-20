import { expect, test } from '@jest/globals'
import * as PrioritizeDefaultBranch from '../src/parts/PrioritizeDefaultBranch/PrioritizeDefaultBranch.ts'

interface Ref {
  readonly name: string
  readonly remote: string
  readonly symbolicRef?: string
}

const local = (name: string): Ref => ({ name, remote: '' })
const remote = (name: string, symbolicRef?: string): Ref => ({ name, remote: 'origin', symbolicRef })

test('puts the local remote default branch first', () => {
  const refs = [local('feature/a'), local('trunk'), remote('origin/HEAD', 'origin/trunk'), remote('origin/trunk')]

  expect(PrioritizeDefaultBranch.prioritizeDefaultBranch(refs)).toEqual([
    local('trunk'),
    local('feature/a'),
    remote('origin/HEAD', 'origin/trunk'),
    remote('origin/trunk'),
  ])
})

test('puts the remote default branch first when there is no local branch', () => {
  const refs = [local('feature/a'), remote('origin/HEAD', 'origin/trunk'), remote('origin/trunk')]

  expect(PrioritizeDefaultBranch.prioritizeDefaultBranch(refs)).toEqual([
    remote('origin/trunk'),
    local('feature/a'),
    remote('origin/HEAD', 'origin/trunk'),
  ])
})

test('falls back to main when the remote default branch is unavailable', () => {
  const refs = [local('feature/a'), local('main'), local('feature/b')]

  expect(PrioritizeDefaultBranch.prioritizeDefaultBranch(refs)).toEqual([local('main'), local('feature/a'), local('feature/b')])
})

test('falls back to remote main when there is no local main branch', () => {
  const refs = [local('feature/a'), remote('origin/main'), local('feature/b')]

  expect(PrioritizeDefaultBranch.prioritizeDefaultBranch(refs)).toEqual([remote('origin/main'), local('feature/a'), local('feature/b')])
})

test('falls back to master when main is unavailable', () => {
  const refs = [local('feature/a'), local('master'), local('feature/b')]

  expect(PrioritizeDefaultBranch.prioritizeDefaultBranch(refs)).toEqual([local('master'), local('feature/a'), local('feature/b')])
})

test('preserves order when no default branch can be identified', () => {
  const refs = [local('feature/a'), local('feature/b')]

  expect(PrioritizeDefaultBranch.prioritizeDefaultBranch(refs)).toBe(refs)
})
