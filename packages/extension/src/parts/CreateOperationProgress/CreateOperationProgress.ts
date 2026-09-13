export const createOperationProgress = (notify: () => Promise<unknown>) => {
  let pending = 0

  const notifyChange = (): void => {
    // Notifications must not delay Git or turn a successful operation into an error.
    void Promise.try(notify).catch(() => {})
  }

  const getProgress = (): boolean => pending > 0

  const run = async <T>(operation: () => Promise<T>): Promise<T> => {
    pending++
    if (pending === 1) {
      notifyChange()
    }
    try {
      return await operation()
    } finally {
      pending--
      if (pending === 0) {
        notifyChange()
      }
    }
  }

  return { getProgress, run }
}
