import { mkdir } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { bundleJs } from '@lvce-editor/package-extension'
import { root } from './root.ts'

export const buildNodeClient = async (outFile: string): Promise<void> => {
  await mkdir(dirname(outFile), { recursive: true })
  await bundleJs(join(root, 'packages', 'node', 'src', 'gitClient.js'), outFile, false)
}
