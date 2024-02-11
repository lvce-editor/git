import { GitError } from '../GitError/GitError.js'

const RE_REF_1 = /^refs\/heads\/([^ ]+) ([0-9a-f]{40}) ([0-9a-f]{40})?$/
const RE_REF_2 = /^refs\/remotes\/([^/]+)\/([^ ]+) ([0-9a-f]{40}) ([0-9a-f]{40})?$/
const RE_REF_3 = /^refs\/tags\/([^ ]+) ([0-9a-f]{40}) ([0-9a-f]{40})?$/

'refs/remotes/origin/HEAD 903f9903f4f14e0d7ec1a389b9da617848e7f609'.match(RE_REF_2) //?
/**
 * @param {string} line
 */
const parseRef = (line) => {
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
  console.log({ line })
  return null
}

const parseRefs = (stdout) => {
  const lines = stdout.split('\n')
  const refs = lines.map(parseRef).filter(Boolean)
  return refs
}

/**
 *
 * @param {{cwd: string, gitPath: string, exec:any }} options
 */
export const getRefs = async ({ cwd, gitPath, exec }) => {
  try {
    console.time('getRefs')
    const gitResult = await exec({
      args: ['for-each-ref', '--format', '%(refname) %(objectname) %(*objectname)'],
      cwd,
      gitPath,
      name: 'init',
    })
    console.timeEnd('getRefs')
    return parseRefs(gitResult.stdout)
  } catch (error) {
    throw new GitError(error, 'getRefs')
  }
}
