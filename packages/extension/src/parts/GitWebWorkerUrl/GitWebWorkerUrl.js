export const getGitWebWorkerUrl = () => {
  return new URL('../../../../git-web/src/gitWebMain.ts', import.meta.url).toString()
}
