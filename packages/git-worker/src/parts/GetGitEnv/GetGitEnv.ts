export const getGitEnv = (): { GIT_OPTIONAL_LOCKS: string; LANG: string; LC_ALL: string } => {
  return {
    GIT_OPTIONAL_LOCKS: '0',
    LANG: 'en_US.UTF-8',
    LC_ALL: 'en_US',
  }
}
