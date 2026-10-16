import { expect, jest, test } from '@jest/globals'
import type { GitExec } from '../src/parts/Types/Types.js'
import * as GitRequestsGetFileBefore from '../src/parts/GitRequestsGetFileBefore/GitRequestGetFileBefore.js'

const createRequest = (exec: GitExec): Promise<string> =>
  GitRequestsGetFileBefore.getFileBefore({
    exec,
    gitPath: '/usr/bin/git',
    repositoryPath: '/repo',
    uri: 'file.txt',
  })

test('getFileBefore returns tracked file contents', async () => {
  const exec: GitExec = jest.fn(async () => ({ stderr: '', stdout: 'tracked contents' }))

  await expect(createRequest(exec)).resolves.toBe('tracked contents')
  expect(exec).toHaveBeenCalledWith({
    args: ['show', 'HEAD:file.txt'],
    cwd: '/repo',
    gitPath: '/usr/bin/git',
    name: 'getFileBefore',
  })
})

test.each([`fatal: path 'file.txt' exists on disk, but not in 'HEAD'.`, `fatal: path 'file.txt' does not exist in 'HEAD'.`])(
  'getFileBefore returns empty contents when the path is absent from HEAD: %s',
  async (stderr) => {
    const exec: GitExec = jest.fn(async () => {
      throw Object.assign(new Error(stderr), { stderr })
    })
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

    try {
      await expect(createRequest(exec)).resolves.toBe('')
      expect(errorSpy).not.toHaveBeenCalled()
    } finally {
      errorSpy.mockRestore()
    }
  },
)

test('getFileBefore returns empty contents when HEAD is missing', async () => {
  const stderr = `fatal: invalid object name 'HEAD'.`
  const exec: GitExec = jest.fn(async () => {
    throw Object.assign(new Error(stderr), { stderr })
  })
  const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

  try {
    await expect(createRequest(exec)).resolves.toBe('')
    expect(errorSpy).not.toHaveBeenCalled()
  } finally {
    errorSpy.mockRestore()
  }
})

test('getFileBefore logs unrelated Git errors', async () => {
  const error = Object.assign(new Error('fatal: unable to read tree'), { stderr: 'fatal: unable to read tree' })
  const exec: GitExec = jest.fn(async () => {
    throw error
  })
  const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

  try {
    await expect(createRequest(exec)).resolves.toBe('')
    expect(errorSpy).toHaveBeenCalledWith(error)
  } finally {
    errorSpy.mockRestore()
  }
})
