function getCommon(strs: string[]): string {
  if (!strs.length) return '';

  let common = strs[0];
  for (let i = 1; i < strs.length; i++) {
    for (let j = 0; j < common.length; j++) {
      if (common[j] !== strs[i][j]) {
        common = common.slice(0, j);
        break;
      }
    }
  }

  return common;
}

// console.log(getCommon(['flower', 'flow', 'flight']));
// console.log(getCommon(['dog', 'racecar', 'car']));

function longestCommonPrefit(strs: string[]): string {
  if (!strs.length) return '';

  let prefix = strs[0];
  for (let i = 1; i < strs.length; i++) {
    while (strs[i].indexOf(prefix) !== 0) {
      prefix = prefix.slice(0, prefix.length - 1);
      if (!prefix.length) return '';
    }
  }

  return prefix;
}

console.log(longestCommonPrefit(['car', 'racecar']));

export default longestCommonPrefit;
