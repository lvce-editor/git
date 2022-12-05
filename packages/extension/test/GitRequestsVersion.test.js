/**
 * @jest-environment lvce-editor
 */
import { jest } from '@jest/globals'
import * as Exec from '../src/parts/Exec/Exec.js'
import * as GitRequestsVersion from '../src/parts/GitRequestsVersion/GitRequestsVersion.js'

test('version', async () => {
  Exec.state.exec = jest.fn(async (command, args) => {
    return {
      stdout: 'git version 2.34.1',
      stderr: '',
    }
  })
  expect(
    await GitRequestsVersion.version({
      cwd: '/test/test-folder',
      gitPath: '',
    })
  ).toBe('2.34.1')
})

test('version - error', async () => {
  Exec.state.exec = jest.fn(async (command, args) => {
    throw new TypeError(`x is not a function`)
  })
  await expect(
    GitRequestsVersion.version({
      cwd: '/test/test-folder',
      gitPath: '',
    })
  ).rejects.toThrowError(new Error('Git: x is not a function'))
})
