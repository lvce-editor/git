import type { GitErrorLike } from '../Types/Types.ts'

const firstLine = (text: string): string => {
  const newLineIndex = text.indexOf('\n')
  if (newLineIndex === -1) {
    return text
  }
  return text.slice(0, text.indexOf('\n'))
}

const isRelevantLine = (line: string): boolean => {
  if (line.startsWith('> ')) {
    return false
  }
  if (line.startsWith('From ')) {
    return false
  }
  if (line.startsWith('* ')) {
    return false
  }
  if (line.startsWith(' *')) {
    return false
  }
  return true
}

const fatalOrHintOrSshOrRemoteLine = (text: string): string => {
  const lines = text.split('\n')
  for (const line of lines) {
    if (isRelevantLine(line)) {
      return line
    }
  }
  return ''
}

// TODO
const errorSnippet = (stderr: string): string => {
  if (/nothing to commit/s.test(stderr)) {
    return 'nothing to commit'
  }
  return fatalOrHintOrSshOrRemoteLine(stderr) || firstLine(stderr)
}

const getGitErrorMessage = (error: GitErrorLike, name: string): string => {
  let errorMessage = `Git: ${name} failed to execute`
  if (error.stderr) {
    errorMessage = `${errorMessage}: ` + errorSnippet(error.stderr)
  }
  return errorMessage
}

const getErrorMessageAndCause = (_error: GitErrorLike, _message: string): { cause: string; errorMessage: string } => {
  return {
    cause: '',
    errorMessage: '',
  }
}

export class GitError extends Error {
  readonly stderr?: string
  readonly isExpected: boolean

  constructor(error: unknown, command: string) {
    const cause = new Error('Git error')
    const gitError = error as GitErrorLike | undefined
    if (gitError?.stderr) {
      cause.message = errorSnippet(gitError.stderr)
    } else {
      cause.message = error instanceof Error ? error.message : `Git: ${command} failed`
    }
    const message = `Git: ${cause.message}`
    super(message)
    if (gitError?.stderr) {
      this.stderr = gitError.stderr
    }
    this.isExpected = true
  }
}
