export function remToPx(rem: number) {
  return rem * parseFloat(getComputedStyle(document.documentElement).fontSize)
}

export function pluralize(count: number, noun: string, suffix = "s") {
  return `${count} ${noun}${count !== 1 ? suffix : ""}`
}
