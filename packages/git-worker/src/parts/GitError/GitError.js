const firstLine = (text) => {
  const newLineIndex = text.indexOf('\n')
  if (newLineIndex === -1) {
    return text
  }
  return text.slice(0, text.indexOf('\n'))
}

const isRelevantLine = (line) => {
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

const fatalOrHintOrSshOrRemoteLine = (text) => {
  const lines = text.split('\n')
  for (const line of lines) {
    if (isRelevantLine(line)) {
      return line
    }
  }
  return ''
}

// TODO
const errorSnippet = (stderr) => {
  console.log({ stderr })
  if (/nothing to commit/s.test(stderr)) {
    return 'nothing to commit'
  }
  return fatalOrHintOrSshOrRemoteLine(stderr) || firstLine(stderr)
}

const getGitErrorMessage = (error, name) => {
  let errorMessage = `Git: ${name} failed to execute`
  if (error.stderr) {
    errorMessage = `${errorMessage}: ` + errorSnippet(error.stderr)
  }
  return errorMessage
}

const getErrorMessageAndCause = (error, message) => {
  return {
    cause: '',
    errorMessage: '',
  }
}

export class GitError extends Error {
  constructor(error, command) {
    const errorMessage = `Git`
    let cause = new Error()
    if (error && error.stderr) {
      cause.message = errorSnippet(error.stderr)
      // @ts-ignore
    } else {
      cause.message = error.message
    }
    super(errorMessage)
    if (error && error.stderr) {
      this.stderr = error.stderr
    }
    this.isExpected = true
  }
}
