import type { Test } from '@lvce-editor/test-with-playwright'

export const skip = true

export const name = 'quick-pick-select-branch'

const gitVersion = () => {
  return {
    stdout: '0.0.0',
    stderr: '',
    exitCode: 0,
  }
}

const gitRevParse = () => {
  return {
    stdout: '',
    stderr: ``,
    exitCode: 0,
  }
}

const gitStatus = () => {
  return {
    stdout: ` M test/file-1.txt
 M test/file-2.txt
`,
    stderr: ``,
    exitCode: 0,
  }
}

const gitForEachRef = () => {
  return {
    stdout: [
      `refs/heads/b f63b3b1b60166f6f3a99e5de7867cc2ae29b9c92 `,
      `refs/heads/main a205f65eaeedfcc0bae56de354220df552d44a52 `,
      `refs/remotes/origin/b f63b3b1b60166f6f3a99e5de7867cc2ae29b9c92 `,
      `refs/remotes/origin/main a205f65eaeedfcc0bae56de354220df552d44a52 `,
    ].join('\n'),
    stderr: '',
    exitCode: 0,
  }
}