const RE_GIT_VERSION = /^git version /

export const parseGitVersion = (raw) => {
  return raw.replace(RE_GIT_VERSION, '')
}
