function lengthOfLongest(s: string): number {
  if (!s) return 0;

  let maxLength = 1;
  let prevStr = s[0];
  for (let i = 1; i < s.length; i++) {
    if (prevStr.includes(s[i])) {
      prevStr = prevStr.slice(prevStr.indexOf(s[i]) + 1) + s[i];
    } else {
      prevStr += s[i];
      if (prevStr.length > maxLength) {
        maxLength = prevStr.length;
      }
    }
  }
  return maxLength;
}

console.log(lengthOfLongest('abcabcbb'));
console.log(lengthOfLongest('bbbbb'));

function lengthOfLongestSubstring(s: string): number {
  if (!s) return 0;

  const n = s.length;
  const map = new Map<string, number>();
  let maxLength = 0;
  let left = 0;
  for (let right = 0; right < n; right++) {
    const rightChar = s[right];
    if (map.has(rightChar) && map.get(rightChar)! >= left) {
      left = map.get(rightChar)! + 1;
    }
    map.set(rightChar, right);
    maxLength = Math.max(right - left + 1, maxLength);
  }

  return maxLength;
}

console.log(lengthOfLongestSubstring('abcabcbb'));
console.log(lengthOfLongestSubstring('bbbbb'));

export default lengthOfLongestSubstring;
