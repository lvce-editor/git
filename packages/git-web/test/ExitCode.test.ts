import { test, expect } from '@jest/globals'
import * as ExitCode from '../src/ExitCode/ExitCode.ts'

test('Success is 0', () => {
  expect(ExitCode.Success).toBe(0)
})

test('GeneralError is 1', () => {
  expect(ExitCode.GeneralError).toBe(1)
})

test('MisuseOfShellBuiltins is 2', () => {
  expect(ExitCode.MisuseOfShellBuiltins).toBe(2)
})

test('CommandCannotExecute is 126', () => {
  expect(ExitCode.CommandCannotExecute).toBe(126)
})

test('CommandNotFound is 127', () => {
  expect(ExitCode.CommandNotFound).toBe(127)
})

test('InvalidExitArgument is 128', () => {
  expect(ExitCode.InvalidExitArgument).toBe(128)
})

test('FatalError is 128', () => {
  expect(ExitCode.FatalError).toBe(128)
})

test('TerminatedByCtrlC is 130', () => {
  expect(ExitCode.TerminatedByCtrlC).toBe(130)
})

test('OutOfRange is 255', () => {
  expect(ExitCode.OutOfRange).toBe(255)
})

test('all exit codes are numbers', () => {
  const codes = [
    ExitCode.Success,
    ExitCode.GeneralError,
    ExitCode.MisuseOfShellBuiltins,
    ExitCode.CommandCannotExecute,
    ExitCode.CommandNotFound,
    ExitCode.InvalidExitArgument,
    ExitCode.FatalError,
    ExitCode.TerminatedByCtrlC,
    ExitCode.OutOfRange
  ]
  
  codes.forEach(code => {
    expect(typeof code).toBe('number')
    expect(Number.isInteger(code)).toBe(true)
  })
})
