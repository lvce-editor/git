import { test, expect } from '@jest/globals'
import { ExecError } from '../src/ExecError/ExecError.ts'

test('ExecError creates error with message', () => {
  const error = new ExecError('stdout', 'stderr', 1)
  
  expect(error).toBeInstanceOf(Error)
  expect(error.name).toBe('ExecError')
  expect(error.message).toBe('stderr')
  expect(error.stdout).toBe('stdout')
  expect(error.stderr).toBe('stderr')
  expect(error.exitCode).toBe(1)
})

test('ExecError uses stdout when stderr is empty', () => {
  const error = new ExecError('stdout', '', 1)
  
  expect(error.message).toBe('stdout')
})

test('ExecError uses default message when both are empty', () => {
  const error = new ExecError('', '', 1)
  
  expect(error.message).toBe('Git command failed')
})

test('ExecError preserves all properties', () => {
  const stdout = 'some output'
  const stderr = 'some error'
  const exitCode = 42
  
  const error = new ExecError(stdout, stderr, exitCode)
  
  expect(error.stdout).toBe(stdout)
  expect(error.stderr).toBe(stderr)
  expect(error.exitCode).toBe(exitCode)
})

test('ExecError is throwable', () => {
  const error = new ExecError('stdout', 'stderr', 1)
  
  expect(() => {
    throw error
  }).toThrow(ExecError)
  
  expect(() => {
    throw error
  }).toThrow('stderr')
})
