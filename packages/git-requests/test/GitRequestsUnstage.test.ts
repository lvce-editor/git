import { jest } from '@jest/globals'
import * as GitRequestsUnstage from '../src/parts/GitRequestsUnstage/GitRequestsUnstage.js'

test('unstage', async (): Promise<void> => {
  const exec = jest.fn(async () => ({ stderr: '', stdout: '' }))
  await GitRequestsUnstage.unstage({
    cwd: '/test/test-folder',
    exec,
    file: '/test/file.txt',
    gitPath: 'git',
  })
  expect(exec).toHaveBeenCalledTimes(1)
  expect(exec).toHaveBeenCalledWith({
    args: ['restore', '--staged', '--', '/test/file.txt'],
    cwd: '/test/test-folder',
    gitPath: 'git',
    name: 'unstage',
  })
})
