import { spawn } from 'node:child_process'
import { cp, mkdir, readFile, readdir, rm, stat, writeFile } from 'node:fs/promises'
import { dirname, extname, join, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const currentDir = dirname(fileURLToPath(import.meta.url))
const root = resolve(currentDir, '../../..')

const getStaticServerPaths = async () => {
  const staticServerPackagePath = fileURLToPath(import.meta.resolve('@lvce-editor/static-server/package.json'))
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
  const testWithPlaywrightPath = fileURLToPath(import.meta.resolve('@lvce-editor/test-with-playwright/bin/test-with-playwright.js'))
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
  const builtinGitWebPath = join(builtinExtensionsPath, 'git-web')
  const builtinGitWorkerPath = join(builtinExtensionsPath, 'git-worker')
  const builtinNodePath = join(builtinExtensionsPath, 'node')
  let originalConfig = ''
  try {
    await mkdir(builtinExtensionPath, { recursive: true })
    await Promise.all([
      cp(join(root, 'packages', 'extension', 'dist'), join(builtinExtensionPath, 'dist'), { recursive: true }),
      cp(join(root, 'packages', 'extension', 'extension.json'), join(builtinExtensionPath, 'extension.json')),
      cp(join(root, 'packages', 'extension', 'icon.png'), join(builtinExtensionPath, 'icon.png')),
      cp(join(root, 'packages', 'extension', 'icons'), join(builtinExtensionPath, 'icons'), { recursive: true }),
      cp(join(root, 'packages', 'git-web', 'dist'), join(builtinGitWebPath, 'dist'), { recursive: true }),
      cp(join(root, 'packages', 'git-worker', 'dist'), join(builtinGitWorkerPath, 'dist'), { recursive: true }),
      cp(join(root, 'packages', 'node'), builtinNodePath, { recursive: true }),
    ])
    originalConfig = await addExtensionFilesToStaticConfig(configPath, staticRoot, [builtinExtensionPath, builtinGitWebPath, builtinGitWorkerPath])
    process.exitCode = await runTests(builtinExtensionsPath, builtinExtensionPath)
  } finally {
    if (originalConfig) {
      await writeFile(configPath, originalConfig)
    }
    await Promise.all(
      [builtinExtensionPath, builtinGitWebPath, builtinGitWorkerPath, builtinNodePath].map((path) => rm(path, { force: true, recursive: true })),
    )
  }
}

await main()
