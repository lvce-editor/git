import chokidar from 'chokidar'

// TODO use more efficient file watcher or the file watcher that the application ships with
export const watch = (path, options) => {
  const watcher = chokidar.watch(path, {
    // ignored: ['**/node_modules/**/*', '**/.git/**/*'],
    ignored: (path) =>
      options.exclude.some((excluded) => path.includes(excluded)),
    ignoreInitial: true,
  })

  return {
    getWatched() {
      return watcher.getWatched()
    },
    dispose() {
      watcher.close()
    },
    on(event, listener) {
      watcher.on(event, listener)
    },
  }
}
