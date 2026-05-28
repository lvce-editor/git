import { join } from 'node:path'
import { execa } from 'execa'
import { root } from './root.ts'
import { runtimeBuildTargets } from './runtimeBuildTargets.ts'

const main = async () => {
  const binaryName = process.platform === 'win32' ? 'esbuild.exe' : 'esbuild'
  const esbuildPath = join(root, 'packages', 'build', 'node_modules', 'esbuild', 'bin', binaryName)
  await Promise.all(
    runtimeBuildTargets.map((target) =>
      execa(esbuildPath, ['--format=esm', '--bundle', target.entryPoint, `--outfile=${target.outfile}`, ...target.extraArgs], {
        cwd: root,
        stdio: 'inherit',
      }),
    ),
  )
}

await main()
