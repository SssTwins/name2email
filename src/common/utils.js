function isNonEmptyStringFast(str) {
  if (typeof str !== 'string') return false
  const len = str.length
  if (len === 0) return false

  // 快速检查首尾字符
  if (str[0] !== ' ' && str[len - 1] !== ' ') return true

  // 需要完整 trim 检查
  return str.trim().length > 0
}

export const isNonEmptyString = isNonEmptyStringFast
