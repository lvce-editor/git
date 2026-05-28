export const getGitWorkerUrl = () => {
  return import.meta.resolve('../../../../git-worker/dist/gitWorkerMain.js').toString()
}
