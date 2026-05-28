export const runtimeBuildTargets = [
  {
    entryPoint: 'packages/extension/src/gitMain.js',
    outfile: 'packages/extension/dist/gitMain.js',
    extraArgs: [],
  },
  {
    entryPoint: 'packages/git-worker/src/gitWorkerMain.ts',
    outfile: 'packages/git-worker/dist/gitWorkerMain.js',
    extraArgs: [],
  },
  {
    entryPoint: 'packages/git-web/src/gitWebMain.ts',
    outfile: 'packages/git-web/dist/gitWebMain.js',
    extraArgs: ['--external:electron', '--external:node*'],
  },
] as const
