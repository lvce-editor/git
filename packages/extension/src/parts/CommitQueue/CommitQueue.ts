type Task = () => Promise<void>

export const create = () => {
  let pending = Promise.resolve()

  const run = async (task: Task): Promise<void> => {
    const previous = pending
    const current = (async () => {
      try {
        await previous
      } catch {
        // A failed task must not prevent later tasks from running.
      }
      await task()
    })()
    pending = current
    try {
      await current
    } finally {
      if (pending === current) {
        pending = Promise.resolve()
      }
    }
  }

  return { run }
}
