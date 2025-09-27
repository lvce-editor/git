import { test, expect } from '@jest/globals'
import { GitWebExec } from '../src/GitWebExec/GitWebExec.js'

test('exec with valid git command', async () => {
  const result = await GitWebExec.exec('git', ['--version'], { cwd: 'web://test' })
  
  expect(result).toEqual({
    stdout: 'git version 2.34.1 (web-emulated)',
    stderr: '',
    exitCode: 0
  })
})

test('exec with invalid gitPath throws error', async () => {
  await expect(
    GitWebExec.exec(null as any, ['--version'], { cwd: 'web://test' })
  ).rejects.toThrow('gitPath must be of type string, was null')
})

test('exec with invalid args throws error', async () => {
  await expect(
    GitWebExec.exec('git', null as any, { cwd: 'web://test' })
  ).rejects.toThrow('args must be an array, was null')
})

test('exec with invalid options throws error', async () => {
  await expect(
    GitWebExec.exec('git', ['--version'], null as any)
  ).rejects.toThrow('options must be an object, was null')
})

test('exec with invalid cwd throws error', async () => {
  await expect(
    GitWebExec.exec('git', ['--version'], { cwd: null as any })
  ).rejects.toThrow('cwd must be of type string, was null')
})

test('exec with unknown command returns error', async () => {
  const result = await GitWebExec.exec('git', ['unknown-command'], { cwd: 'web://test' })
  
  expect(result.stderr).toContain('is not a git command')
  expect(result.exitCode).toBe(127)
})

test('exec with empty args shows usage', async () => {
  const result = await GitWebExec.exec('git', [], { cwd: 'web://test' })
  
  expect(result.stderr).toContain('usage: git')
  expect(result.exitCode).toBe(1)
})
