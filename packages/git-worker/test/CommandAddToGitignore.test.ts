/// <reference types="node" />
/* eslint-disable jest/no-restricted-jest-methods */
import { afterEach, beforeEach, expect, jest, test } from '@jest/globals'
import { execFile } from 'node:child_process'
import { access, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { promisify } from 'node:util'

const exec = promisify(execFile)
const state = { directory: '' }
jest.unstable_mockModule('../src/parts/Rpc/Rpc.ts', () => ({
  invoke: async (method: string, uri: string, content: string): Promise<unknown> => {
    switch (method) {
      case 'Config.getWorkspaceFolder':
        return state.directory
      case 'FileSystem.exists':
        try {
          await access(uri)
          return true
        } catch {
          return false
        }
      case 'FileSystem.readFile':
        return readFile(uri, 'utf8')
      case 'FileSystem.writeFile':
        return writeFile(uri, content)
      default:
        throw new Error(`Unexpected RPC ${method}`)
    }
  },
}))
const { commandAddToGitignore } = await import('../src/parts/CommandAddToGitignore/CommandAddToGitignore.ts')
beforeEach(async () => {
  state.directory = await mkdtemp(join(tmpdir(), 'lvce-gitignore-'))
  await exec('git', ['init'], { cwd: state.directory })
})
afterEach(async () => {
  await rm(state.directory, { force: true, recursive: true })
})

test('creates an anchored literal pattern that Git recognizes', async () => {
  const file = 'nested/file [1]*?.txt'
  await commandAddToGitignore(file)
  const result = await exec('git', ['check-ignore', '--no-index', '--', file], { cwd: state.directory })
  expect(result.stdout.trim()).toBe(file)
  await expect(exec('git', ['check-ignore', '--no-index', '--', 'nested/file 1xx.txt'], { cwd: state.directory })).rejects.toThrow()
})

test('preserves existing rules and adds a missing newline without duplicates', async () => {
  const uri = join(state.directory, '.gitignore')
  await writeFile(uri, '# existing\r\nnode_modules/')
  await commandAddToGitignore('output.txt')
  await commandAddToGitignore('output.txt')
  expect(await readFile(uri, 'utf8')).toBe('# existing\r\nnode_modules/\r\n/output.txt\r\n')
})

test.each(['', '/absolute', '../outside', 'a/../outside', 'C:/absolute', 'a\nb', 'a\rb'])('rejects invalid path %s', async (file) => {
  await expect(commandAddToGitignore(file)).rejects.toThrow('repository-relative')
})
