import { join } from 'node:path'
import { execa } from 'execa'
import { root } from './root.ts'

const main = async () => {
  const binaryName = process.platform === 'win32' ? 'esbuild.exe' : 'esbuild'
  const esbuildPath = join(root, 'packages', 'build', 'node_modules', 'esbuild', 'bin', binaryName)
  execa(esbuildPath, ['--format=esm', '--bundle', '--watch', 'packages/extension/src/gitMain.js', '--outfile=packages/extension/dist/gitMain.js'], {
    cwd: root,
    stdio: 'inherit',
  })
  execa(
    esbuildPath,
    ['--format=esm', '--bundle', '--watch', 'packages/git-worker/src/gitWorkerMain.ts', '--outfile=packages/git-worker/dist/gitWorkerMain.js'],
    {
      cwd: root,
      stdio: 'inherit',
    },
  )
  execa(
    esbuildPath,
    [
      '--format=esm',
      '--bundle',
      '--watch',
      'packages/git-web/src/gitWebMain.ts',
      '--outfile=packages/git-web/dist/gitWebMain.js',
      '--external:electron',
      '--external:node*',
    ],
    {
      cwd: root,
      stdio: 'inherit',
    },
  )
}

main()
