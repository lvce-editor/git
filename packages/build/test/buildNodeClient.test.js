import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import { mkdtemp, readFile, rm } from 'node:fs/promises'
import { NodeForkedProcessRpcParent, WebSocketRpcParent } from '@lvce-editor/rpc'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import test from 'node:test'
import { buildNodeClient, buildNodeProcess } from '../src/buildNodeClient.ts'

test('builds a self-contained node client', async () => {
  const temporaryDirectory = await mkdtemp(join(tmpdir(), 'builtin-git-node-client-'))
  try {
    const outFile = join(temporaryDirectory, 'gitClient.js')
    await buildNodeClient(outFile)

    const gitClient = await import(pathToFileURL(outFile).toString())

    assert.deepEqual(Object.keys(gitClient), ['commandMap'])
  } finally {
    await rm(temporaryDirectory, { force: true, recursive: true })
  }
})

test('builds a self-contained node process entrypoint', async () => {
  const temporaryDirectory = await mkdtemp(join(tmpdir(), 'builtin-git-node-process-'))
  try {
    const outFile = join(temporaryDirectory, 'gitProcess.js')
    await buildNodeProcess(outFile)

    const content = await readFile(outFile, 'utf8')

    assert.match(content, /NodeRpcProcess\.handleWebSocket/)
    assert.match(content, /Exec\.exec/)
  } finally {
    await rm(temporaryDirectory, { force: true, recursive: true })
  }
})

test('starts the packaged node process and invokes a git command', async () => {
  const temporaryDirectory = await mkdtemp(join(tmpdir(), 'builtin-git-node-process-'))
  const server = createServer()
  let controlRpc
  let rpc
  try {
    const outFile = join(temporaryDirectory, 'gitProcess.js')
    await buildNodeProcess(outFile)
    controlRpc = await NodeForkedProcessRpcParent.create({ commandMap: {}, path: outFile })
    const { promise: attached, reject, resolve } = Promise.withResolvers()
    server.on('upgrade', (request, socket) => {
      socket.pause()
      const serializableRequest = { headers: request.headers, method: request.method, url: request.url }
      controlRpc.invokeAndTransfer('NodeRpcProcess.handleWebSocket', socket, serializableRequest).then(resolve, reject)
    })
    await new Promise((resolve, reject) => {
      server.once('error', reject)
      server.listen(0, '127.0.0.1', resolve)
    })
    const address = server.address()
    assert.ok(address && typeof address === 'object')
    const webSocket = new WebSocket(`ws://127.0.0.1:${address.port}`)
    rpc = await WebSocketRpcParent.create({ commandMap: {}, webSocket })
    await attached

    const result = await rpc.invoke('Exec.exec', process.execPath, ['-e', 'process.stdout.write("git-process-ok")'], {})

    assert.equal(result.stdout, 'git-process-ok')
    assert.equal(result.exitCode, 0)
  } finally {
    await rpc?.dispose()
    await controlRpc?.dispose()
    server.closeAllConnections()
    await new Promise((resolve) => server.close(resolve))
    await rm(temporaryDirectory, { force: true, recursive: true })
  }
})
