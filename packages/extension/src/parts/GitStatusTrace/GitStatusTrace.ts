const entries: unknown[] = []

export const record = (event: string, data: unknown = undefined): void => {
  if (entries.length < 1000) {
    entries.push({ sequence: entries.length, time: performance.now(), event, data })
  }
}

export const get = (): readonly unknown[] => entries
