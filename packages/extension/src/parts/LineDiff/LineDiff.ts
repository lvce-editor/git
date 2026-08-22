// Alignment algorithm based on https://johnresig.com/projects/javascript-diff-algorithm/ (MIT License).

type AlignmentEntry = number | { nc: number; oc: number; oldLineNumber: number }

const createUnmatchedEntry = (): Exclude<AlignmentEntry, number> => ({ nc: 0, oc: 0, oldLineNumber: -1 })

const isMatched = (entry: AlignmentEntry | undefined): entry is number => typeof entry === 'number'

const setMatch = (oldMap: AlignmentEntry[], newMap: AlignmentEntry[], oldIndex: number, newIndex: number): void => {
  oldMap[oldIndex] = newIndex
  newMap[newIndex] = oldIndex
}

const makeDiffMap = (oldLines: readonly string[], newLines: readonly string[]) => {
  const map: Record<string, { nc: number; oc: number; oldLineNumber: number }> = Object.create(null)
  const newMap: AlignmentEntry[] = []
  for (const line of newLines) {
    const entry = (map[line] ||= { nc: 0, oc: 0, oldLineNumber: -1 })
    entry.nc++
    newMap.push(entry)
  }
  const oldMap: AlignmentEntry[] = []
  for (const [index, line] of oldLines.entries()) {
    const entry = (map[line] ||= { nc: 0, oc: 0, oldLineNumber: -1 })
    entry.oc++
    entry.oldLineNumber = index
    oldMap.push(entry)
  }
  return { newMap, oldMap }
}

const getLocalMatches = (newMap: AlignmentEntry[], oldMap: AlignmentEntry[]): Array<{ newIndex: number; oldIndex: number }> => {
  for (let index = 0; index < newMap.length; index++) {
    const entry = newMap[index]
    if (!isMatched(entry) && entry.nc === 1 && entry.oc === 1) {
      newMap[index] = entry.oldLineNumber
      oldMap[entry.oldLineNumber] = index
    }
  }
  for (let index = 0; index < newMap.length - 1; index++) {
    const oldIndex = newMap[index]
    if (isMatched(oldIndex) && newMap[index + 1] === oldMap[oldIndex + 1]) {
      oldMap[oldIndex + 1] = index + 1
      newMap[index + 1] = oldIndex + 1
    }
  }
  for (let index = newMap.length - 1; index > 0; index--) {
    const oldIndex = newMap[index]
    if (isMatched(oldIndex) && newMap[index - 1] === oldMap[oldIndex - 1]) {
      newMap[index - 1] = oldIndex - 1
      oldMap[oldIndex - 1] = index - 1
    }
  }
  const matches: Array<{ newIndex: number; oldIndex: number }> = []
  for (let newIndex = 0; newIndex < newMap.length; newIndex++) {
    const oldIndex = newMap[newIndex]
    if (isMatched(oldIndex)) {
      matches.push({ newIndex, oldIndex })
    }
  }
  return matches
}

const alignRange = (
  oldMap: AlignmentEntry[],
  newMap: AlignmentEntry[],
  oldLines: readonly string[],
  newLines: readonly string[],
  initialOldStart: number,
  initialOldEnd: number,
  initialNewStart: number,
  initialNewEnd: number,
): void => {
  let oldStart = initialOldStart
  let oldEnd = initialOldEnd
  let newStart = initialNewStart
  let newEnd = initialNewEnd
  while (oldStart < oldEnd && newStart < newEnd && oldLines[oldStart] === newLines[newStart]) {
    setMatch(oldMap, newMap, oldStart++, newStart++)
  }
  while (oldStart < oldEnd && newStart < newEnd && oldLines[oldEnd - 1] === newLines[newEnd - 1]) {
    setMatch(oldMap, newMap, --oldEnd, --newEnd)
  }
  if (oldStart >= oldEnd || newStart >= newEnd) {
    return
  }
  const local = makeDiffMap(oldLines.slice(oldStart, oldEnd), newLines.slice(newStart, newEnd))
  const matches = getLocalMatches(local.newMap, local.oldMap)
  if (matches.length === 0) {
    return
  }
  for (const match of matches) {
    setMatch(oldMap, newMap, oldStart + match.oldIndex, newStart + match.newIndex)
  }
  let currentOldStart = oldStart
  let currentNewStart = newStart
  for (const match of matches) {
    const matchedOldIndex = oldStart + match.oldIndex
    const matchedNewIndex = newStart + match.newIndex
    alignRange(oldMap, newMap, oldLines, newLines, currentOldStart, matchedOldIndex, currentNewStart, matchedNewIndex)
    currentOldStart = matchedOldIndex + 1
    currentNewStart = matchedNewIndex + 1
  }
  alignRange(oldMap, newMap, oldLines, newLines, currentOldStart, oldEnd, currentNewStart, newEnd)
}

export const getAlignmentMaps = (oldLines: readonly string[], newLines: readonly string[]) => {
  const oldMap = Array.from({ length: oldLines.length }, createUnmatchedEntry)
  const newMap = Array.from({ length: newLines.length }, createUnmatchedEntry)
  alignRange(oldMap, newMap, oldLines, newLines, 0, oldLines.length, 0, newLines.length)
  return { newMap, oldMap }
}
