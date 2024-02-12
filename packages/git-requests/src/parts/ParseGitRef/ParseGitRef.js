const RE_REF_1 = /^refs\/heads\/([^ ]+) ([0-9a-f]{40}) ([0-9a-f]{40})?$/
const RE_REF_2 = /^refs\/remotes\/([^/]+)\/([^ ]+) ([0-9a-f]{40}) ([0-9a-f]{40})?$/
const RE_REF_3 = /^refs\/tags\/([^ ]+) ([0-9a-f]{40}) ([0-9a-f]{40})?$/

/**
 * @param {string} line
 */
export const parseGitRef = (line) => {
  let match
  if ((match = line.match(RE_REF_1))) {
    return { name: match[1], commit: match[2], type: 'head' }
  }
  if ((match = line.match(RE_REF_2))) {
    return {
      name: `${match[1]}/${match[2]}`,
      commit: match[3],
      type: 'remoteHead',
      remote: match[1],
    }
  }
  if ((match = line.match(RE_REF_3))) {
    return {
      name: match[1],
      commit: match[3] ?? match[2],
      type: 'tag',
    }
  }
  return null
}
