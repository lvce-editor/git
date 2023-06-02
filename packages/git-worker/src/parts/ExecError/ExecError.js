import * as GetFirstLine from '../GetFirstLine/GetFirstLine.js'

export class ExecError extends Error {
  constructor(stdout, stderr, exitCode) {
    const firstLine = GetFirstLine.getFirstLine(stderr)
    super(firstLine)
    this.stdout = stdout
    this.stderr = stderr
    this.exitCode = exitCode
    this.name = 'ExecError'
  }
}
