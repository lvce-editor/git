import { spawn } from 'node:child_process'
import { cp, readFile, readdir, rm, stat, writeFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { dirname, extname, join, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const currentDir = dirname(fileURLToPath(import.meta.url))
const root = resolve(currentDir, '..')
const requireFromE2e = createRequire(join(root, 'packages', 'e2e', 'package.json'))
const requireFromServer = createRequire(join(root, 'packages', 'server', 'package.json'))

const getStaticServerPaths = async () => {
  const serverPackagePath = requireFromServer.resolve('@lvce-editor/server/package.json')
  const requireFromLvceServer = createRequire(serverPackagePath)
  const staticServerPackagePath = requireFromLvceServer.resolve('@lvce-editor/static-server/package.json')
  const staticServerRoot = dirname(staticServerPackagePath)
  const staticRoot = join(staticServerRoot, 'static')
  const entries = await readdir(staticRoot, { withFileTypes: true })
  const candidates = []
  for (const entry of entries) {
    if (!entry.isDirectory()) {
      continue
    }
    const extensionsPath = join(staticRoot, entry.name, 'extensions')
    try {
      if ((await stat(extensionsPath)).isDirectory()) {
        candidates.push(extensionsPath)
      }
    } catch {}
  }
  if (candidates.length !== 1) {
    throw new Error(`Expected one built-in extensions directory, found ${candidates.length}`)
  }
  return {
    builtinExtensionsPath: candidates[0],
    configPath: join(staticServerRoot, 'config.json'),
    staticRoot,
  }
}

const getFiles = async (path) => {
  const entries = await readdir(path, { withFileTypes: true })
  const files = []
  for (const entry of entries) {
    const childPath = join(path, entry.name)
    if (entry.isDirectory()) {
      files.push(...(await getFiles(childPath)))
    } else if (entry.isFile()) {
      files.push(childPath)
    }
  }
  return files
}

const addExtensionFilesToStaticConfig = async (configPath, staticRoot, extensionPaths) => {
  const originalConfig = await readFile(configPath, 'utf8')
  const config = JSON.parse(originalConfig)
  const headerIndexByExtension = new Map()
  const staticFiles = Object.entries(config.files)
  for (const onlyExtensionFiles of [true, false]) {
    for (const [path, headerIndex] of staticFiles) {
      if (path.includes('/extensions/') !== onlyExtensionFiles) {
        continue
      }
      const extension = extname(path)
      if (extension && !headerIndexByExtension.has(extension)) {
        headerIndexByExtension.set(extension, headerIndex)
      }
    }
  }
  for (const extensionPath of extensionPaths) {
    for (const path of await getFiles(extensionPath)) {
      const extension = extname(path)
      const headerIndex = headerIndexByExtension.get(extension)
      if (headerIndex === undefined) {
        throw new Error(`No static response headers found for ${extension}`)
      }
      const requestPath = '/' + relative(staticRoot, path).split(sep).join('/')
      config.files[requestPath] = headerIndex
    }
  }
  await writeFile(configPath, JSON.stringify(config, null, 2) + '\n')
  return originalConfig
}

const runTests = async (builtinExtensionsPath, builtinExtensionPath) => {
  const testWithPlaywrightPath = requireFromE2e.resolve('@lvce-editor/test-with-playwright/bin/test-with-playwright.js')
  const args = [testWithPlaywrightPath, `--only-extension=${builtinExtensionPath}`, '--test-path=.', ...process.argv.slice(2)]
  const child = spawn(process.execPath, args, {
    env: {
      ...process.env,
      BUILTIN_EXTENSIONS_PATH: builtinExtensionsPath,
    },
    stdio: 'inherit',
  })
  return new Promise((resolve, reject) => {
    child.on('error', reject)
    child.on('exit', (code, signal) => {
      if (signal) {
        reject(new Error(`Test process exited with signal ${signal}`))
        return
      }
      resolve(code ?? 1)
    })
  })
}

const main = async () => {
  const { builtinExtensionsPath, configPath, staticRoot } = await getStaticServerPaths()
  const builtinExtensionPath = join(builtinExtensionsPath, 'builtin.git')
  let originalConfig = ''
  try {
    await cp(join(root, 'dist'), builtinExtensionPath, { recursive: true })
    originalConfig = await addExtensionFilesToStaticConfig(configPath, staticRoot, [builtinExtensionPath])
    process.exitCode = await runTests(builtinExtensionsPath, builtinExtensionPath)
  } finally {
    if (originalConfig) {
      await writeFile(configPath, originalConfig)
    }
    await rm(builtinExtensionPath, { force: true, recursive: true })
  }
}

await main()
