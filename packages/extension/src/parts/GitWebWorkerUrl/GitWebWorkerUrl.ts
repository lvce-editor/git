export const getGitWebWorkerUrl = () => {
  return new URL('../../../../git-web/dist/gitWebMain.js', import.meta.url).toString()
}
