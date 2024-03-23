export const getGitWorkerUrl = () => {
  return new URL('../../../../git-worker/src/gitWorkerMain.ts', import.meta.url).toString()
}
