import { build } from 'esbuild'
import { root } from './root.ts'
import { runtimeBuildTargets } from './runtimeBuildTargets.ts'

const main = async () => {
  await Promise.all(
    [
      ...runtimeBuildTargets,
      {
        entryPoint: 'packages/e2e/fixtures/branch-protection-dialog/main.ts',
        external: ['electron', 'node*'],
        outfile: 'packages/e2e/fixtures/branch-protection-dialog/dist/main.js',
      },
    ].map((target) =>
      build({
        absWorkingDir: root,
        bundle: true,
        entryPoints: [target.entryPoint],
        external: target.external,
        format: 'esm',
        outfile: target.outfile,
      }),
    ),
  )
}

await main()
