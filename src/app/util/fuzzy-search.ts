export const fuzzySearch = (needle: string, haystack: string): boolean => {
  if (!needle || !haystack) return false;

  const hlen = haystack.length;
  const nlen = needle.length;

  if (nlen > hlen) {
    return false;
  }
  if (nlen === hlen) {
    return needle === haystack;
  }

  let j = 0;
  for (let i = 0; i < nlen; i++) {
    const nch = needle.charCodeAt(i);
    let found = false;
    while (j < hlen) {
      if (haystack.charCodeAt(j++) === nch) {
        found = true;
        break;
      }
    }
    if (!found) {
      return false;
    }
  }
  return true;
};
