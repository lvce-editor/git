import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.quick-pick-clone'

export const test: Test = async ({ expect, FileSystem, Locator, QuickPick, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  await Workspace.setPath(tmpDir)

  await QuickPick.open()
  await QuickPick.setValue('>Git: Clone')
  await QuickPick.selectItem('Git: Clone', { waitUntil: 'none' })
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const input = Locator('input[name="QuickPickInput"][placeholder="Repository URL"]')
  await expect(input).toBeVisible()
  await expect(input).toBeFocused()
}
