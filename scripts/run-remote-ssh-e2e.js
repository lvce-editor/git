import { spawn } from 'node:child_process'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const remoteSshRoot = process.env.LVCE_REMOTE_SSH_TEST_REPO
if (!remoteSshRoot) {
  throw new Error('Set LVCE_REMOTE_SSH_TEST_REPO to a checkout of lvce-editor/remote-ssh with dependencies installed')
}
const env = {
  ...process.env,
  LVCE_REMOTE_SSH_TEST_GIT_EXTENSION_PATH: resolve(root, 'dist'),
  LVCE_REMOTE_SSH_TEST_GIT_SCENARIO: resolve(root, 'packages/e2e/scripts/git-remote-ssh.js'),
}
const run = async (args) => {
  const child = spawn(process.execPath, args, { cwd: remoteSshRoot, env, stdio: 'inherit' })
  await new Promise((resolve, reject) => {
    child.once('error', reject)
    child.once('exit', (code, signal) => {
      if (code === 0) {
        resolve()
      } else {
        reject(new Error(`SSH e2e command exited with ${signal || code}`))
      }
    })
  })
}
await run(['packages/build/src/build.ts'])
await run(['packages/build/src/build-extension.ts'])
await run(['packages/e2e/scripts/run-e2e.js', '--headless'])
