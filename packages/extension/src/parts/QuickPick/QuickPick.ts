const toPick = (pick) => {
  return pick
}

export const show = async (picks) => {
  const getPicks = () => {
    return picks
  }
  // @ts-ignore
  const selectedPick = await vscode.showQuickPick({
    getPicks,
    toPick,
  })
  return selectedPick
}
