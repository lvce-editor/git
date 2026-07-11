export interface GitInvocation {
  readonly command: readonly string[]
  readonly cwd: string
}

const invocations: GitInvocation[] = []

const normalizeArg = (cwd: string, arg: string): string => {
  if (!cwd.startsWith('file://')) {
    return arg
  }
  if (arg.startsWith('/')) {
    return `file://${arg}`
  }
  if (/^[A-Za-z]:[\\/]/.test(arg)) {
    return `file:///${arg.replaceAll('\\', '/')}`
  }
  return arg
}

export const add = (cwd: string, args: readonly string[]): void => {
  if (args[0] === 'config') {
    return
  }
  invocations.push({
    command: ['git', ...args.map((arg) => normalizeArg(cwd, arg))],
    cwd,
  })
}

export const get = (): readonly GitInvocation[] => {
  return invocations
}

export const reset = (): void => {
  invocations.length = 0
}
