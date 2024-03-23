import { packageExtension, bundleJs } from '@lvce-editor/package-extension'
import fs, { readFileSync } from 'fs'
import path, { join } from 'path'
import { replace } from './replace.js'
import { root } from './root.js'

const extension = path.join(root, 'packages', 'extension')
const cssWorker = path.join(root, 'packages', 'css-worker')

fs.rmSync(join(root, 'dist'), { recursive: true, force: true })

fs.mkdirSync(path.join(root, 'dist'))

const packageJson = JSON.parse(
  readFileSync(join(extension, 'package.json')).toString()
)
delete packageJson.xo
delete packageJson.jest
delete packageJson.prettier
delete packageJson.devDependencies

fs.writeFileSync(
  join(root, 'dist', 'package.json'),
  JSON.stringify(packageJson, null, 2) + '\n'
)
fs.copyFileSync(join(root, 'README.md'), join(root, 'dist', 'README.md'))
fs.copyFileSync(join(extension, 'icon.png'), join(root, 'dist', 'icon.png'))
fs.copyFileSync(
  join(extension, 'extension.json'),
  join(root, 'dist', 'extension.json')
)
fs.cpSync(join(extension, 'src'), join(root, 'dist', 'src'), {
  recursive: true,
})
fs.cpSync(join(cssWorker, 'src'), join(root, 'dist', 'css-worker', 'src'), {
  recursive: true,
})
fs.cpSync(join(cssWorker, 'data'), join(root, 'dist', 'css-worker', 'data'), {
  recursive: true,
})

const workerUrlFilePath = path.join(
  root,
  'dist',
  'src',
  'parts',
  'CssWorkerUrl',
  'CssWorkerUrl.ts'
)

replace({
  path: workerUrlFilePath,
  occurrence: '../../../../css-worker/src/cssWorkerMain.ts',
  replacement: '../css-worker/dist/cssWorkerMain.js',
})

replace({
  path: join(
    root,
    'dist',
    'css-worker',
    'src',
    'parts',
    'ImportJson',
    'ImportJson.ts'
  ),
  occurrence: `../../../\${path}`,
  replacement: `../\${path}`,
})

replace({
  path: join(root, 'dist', 'extension.json'),
  occurrence: 'src/languageFeaturesCssMain.ts',
  replacement: 'dist/languageFeaturesCssMain.js',
})

await bundleJs(
  join(root, 'dist', 'css-worker', 'src', 'cssWorkerMain.ts'),
  join(root, 'dist', 'css-worker', 'dist', 'cssWorkerMain.js')
)

await bundleJs(
  join(root, 'dist', 'src', 'languageFeaturesCssMain.ts'),
  join(root, 'dist', 'dist', 'languageFeaturesCssMain.js')
)

await packageExtension({
  highestCompression: true,
  inDir: join(root, 'dist'),
  outFile: join(root, 'extension.tar.br'),
})
