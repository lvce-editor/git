export const getGitWorkerUrl = () => {
  return new URL(
    '../../../../git-worker/src/gitWorkerMain.js',
    import.meta.url
  ).toString()
}
