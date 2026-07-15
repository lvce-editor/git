import { showQuickPick } from '@lvce-editor/api'

const toPick = (pick) => {
  return {
    ...pick,
    value: pick,
  }
}

export const show = async (picks) => {
  return showQuickPick({
    items: picks.map(toPick),
    placeholder: 'Select a branch',
  })
}
