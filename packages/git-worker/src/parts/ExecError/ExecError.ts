import * as GetFirstLine from '../GetFirstLine/GetFirstLine.js'

export class ExecError extends Error {
  constructor(stdout, stderr, exitCode) {
    const firstLine = GetFirstLine.getFirstLine(stderr)
    super(firstLine)
    // @ts-ignore
    this.stdout = stdout
    // @ts-ignore
    this.stderr = stderr
    // @ts-ignore
    this.exitCode = exitCode
    this.name = 'ExecError'
  }
}
