import { createRequire } from 'node:module'
import { join } from 'node:path'
import { execa } from 'execa'
import { root } from './root.ts'

const main = async () => {
  await import('./build-watch.ts')

  const require = createRequire(join(root, 'packages', 'server', 'package.json'))
  const serverPath = require.resolve('@lvce-editor/server/bin/server.js')
  execa('node', [serverPath, '--test-path=packages/e2e', '--only-extension=packages/extension'], {
    cwd: root,
    stdio: 'inherit',
  })
}

main()
