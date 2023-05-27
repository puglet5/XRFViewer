// https://github.com/d3/d3-array/blob/main/src/blur.js

function bluri(radius: number) {
  const w = 2 * radius + 1
  return (
    T: number[],
    S: number[],
    start: number,
    stop: number,
    step: number
  ) => {
    if (!((stop -= step) >= start)) return
    let sum = radius * S[start]
    const s = step * radius
    for (let i = start, j = start + s; i < j; i += step) {
      sum += S[Math.min(stop, i)]
    }
    for (let i = start, j = stop; i <= j; i += step) {
      sum += S[Math.min(stop, i + s)]
      T[i] = sum / w
      sum -= S[Math.max(start, i - s)]
    }
  }
}

export function smooth(values: number[], radius: number) {
  let length = values.length
  if (!length || !radius) return values
  const blur = bluri(radius)
  const temp = [...values]
  blur(values, temp, 0, length, 1)
  blur(temp, values, 0, length, 1)
  blur(values, temp, 0, length, 1)
  return values
}
