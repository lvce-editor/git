import { spawn } from 'node:child_process'
import { readFile, readdir, writeFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { dirname, join, resolve, sep } from 'node:path'
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
// The harness serves a candidate extension, so index its SVGs alongside the
// runtime's static assets rather than relying on the bundled Git version.
const requireFromRemote = createRequire(join(remoteSshRoot, 'package.json'))
const requireFromServer = createRequire(requireFromRemote.resolve('@lvce-editor/server/package.json'))
const configPath = join(dirname(requireFromServer.resolve('@lvce-editor/static-server/package.json')), 'config.json')
const originalConfig = await readFile(configPath, 'utf8')
const config = JSON.parse(originalConfig)
const paths = Object.keys(config.files)
const extensionPrefix = paths.find((path) => /^\/[^/]+\/extensions\//.test(path))?.match(/^\/[^/]+\/extensions\//)?.[0]
const svgPath = paths.find((path) => path.endsWith('.svg'))
if (!extensionPrefix || svgPath === undefined) {
  throw new Error('Remote SSH runtime has no extension prefix or SVG response headers')
}
for (const path of await readdir(join(root, 'dist/icons'), { recursive: true })) {
  if (path.endsWith('.svg')) {
    config.files[`${extensionPrefix}builtin.git/icons/${path.split(sep).join('/')}`] = config.files[svgPath]
  }
}
try {
  await writeFile(configPath, JSON.stringify(config, null, 2) + '\n')
  await run(['packages/e2e/scripts/run-e2e.js', '--headless'])
} finally {
  await writeFile(configPath, originalConfig)
}
