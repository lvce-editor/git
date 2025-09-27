export class ExecError extends Error {
  public readonly stdout: string
  public readonly stderr: string
  public readonly exitCode: number

  constructor(stdout: string, stderr: string, exitCode: number) {
    super(stderr || stdout || 'Git command failed')
    this.name = 'ExecError'
    this.stdout = stdout
    this.stderr = stderr
    this.exitCode = exitCode
  }
}
