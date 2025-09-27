import type { Test } from '@lvce-editor/test-with-playwright'
import { createGitMockRpc } from './test-helpers/gitMockHelper.js'

export const skip = true

export const name = 'git.pull-error-repository-not-found'

export const mockRpc = await createGitMockRpc('pull-error-repository-not-found')

export const test: Test = async ({ FileSystem, Workspace, QuickPick, Locator, expect }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)

  // act
  await QuickPick.executeCommand('Git: Pull')

  // assert
  const notification = Locator('#DialogBodyErrorMessage')
  await expect(notification).toBeVisible()
  await expect(notification).toHaveText('Error: Git: Repository not found.')
}

