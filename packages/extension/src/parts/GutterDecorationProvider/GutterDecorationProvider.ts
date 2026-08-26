import { getPreference, getWorkspaceFolder, type EditorGutterDecorationProvider } from '@lvce-editor/api'
import * as Exec from '../Exec/Exec.ts'
import { createProvideGutterDecorations } from '../GutterDecorations/GutterDecorations.ts'

export const id = 'git.gutterDecorations'

export const provideEditorGutterDecorations: EditorGutterDecorationProvider['provideEditorGutterDecorations'] = createProvideGutterDecorations({
  execute: Exec.exec,
  getGutterDecorationsEnabled: () => getPreference('git.gutterDecorations'),
  getWorkspaceFolder,
})
