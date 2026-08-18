import { getPreference, getWorkspaceFolder, type EditorLineDecorationProvider } from '@lvce-editor/api'
import * as Exec from '../Exec/Exec.ts'
import { createProvideInlineBlame } from '../InlineBlame/InlineBlame.ts'

export const id = 'git.inlineBlame'

export const provideEditorLineDecoration: EditorLineDecorationProvider['provideEditorLineDecoration'] = createProvideInlineBlame({
  execute: Exec.exec,
  getInlineBlameEnabled: () => getPreference('git.inlineBlame'),
  getWorkspaceFolder,
})
