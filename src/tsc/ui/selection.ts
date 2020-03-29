export const getSelectionRanges = () => {
  const selection = window.getSelection();
  if (selection === null) {
    return null;
  }

  const selectionRanges = [];
  for (let idx = 0; idx < selection.rangeCount; idx++) {
    selectionRanges.push(selection.getRangeAt(idx));
  }
  return selectionRanges;
};

export const restoreSelection = (selectionRanges: Range[] | null) => {
  if (selectionRanges === null || selectionRanges.length === 0) {
    return;
  }

  const selection = window.getSelection();
  if (selection !== null) {
    selection.removeAllRanges();
    selectionRanges.forEach(range => selection.addRange(range));
  }
};
