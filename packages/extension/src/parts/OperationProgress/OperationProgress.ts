import { executeCommand } from '@lvce-editor/api'
import { createOperationProgress } from '../CreateOperationProgress/CreateOperationProgress.ts'

export const { getProgress, run } = createOperationProgress(() => executeCommand('Layout.handleSourceControlProgressChange'))
