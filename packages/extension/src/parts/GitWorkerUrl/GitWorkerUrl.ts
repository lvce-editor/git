export const getGitWorkerUrl = () => {
  return new URL('../../git-worker/dist/gitWorkerMain.js', import.meta.url).toString()
}
