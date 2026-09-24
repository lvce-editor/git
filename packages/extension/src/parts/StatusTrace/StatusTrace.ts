const entries: unknown[] = []

export const record = (event: string, data: unknown = undefined): void => {
  if (entries.length < 200) entries.push({ data, event, time: performance.now() })
}

export const get = (): readonly unknown[] => entries
