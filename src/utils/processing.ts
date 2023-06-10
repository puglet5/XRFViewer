import { ParsedData, Peak } from "../common/interfaces"

function blur(
  T: number[],
  S: number[],
  start: number,
  stop: number,
  step: number,
  radius: number
) {
  if (!((stop -= step) >= start)) return
  let sum = radius * S[start]
  const s = step * radius
  for (let i = start, j = start + s; i < j; i += step) {
    sum += S[Math.min(stop, i)]
  }
  for (let i = start, j = stop; i <= j; i += step) {
    sum += S[Math.min(stop, i + s)]
    T[i] = sum / (2 * radius + 1)
    sum -= S[Math.max(start, i - s)]
  }
}

function calculateFirstDerivative(data: number[], step: number) {
  const [a, b, c, d] = [-11 / 6, 3, -1.5, 1 / 3]
  const firstDerivative = data.flatMap((e, i) =>
    i < data.length - 4
      ? (a * data[i] + b * data[i + 1] + c * data[i + 2] + d * data[i + 3]) /
        step
      : 0
  )
  return firstDerivative
}

function calculateSecondDerivative(data: number[], step: number) {
  const [a, b, c, d] = [2, -5, 4, -1]
  const secondDerivative = data.flatMap((e, i) =>
    i < data.length - 4
      ? (a * data[i] + b * data[i + 1] + c * data[i + 2] + d * data[i + 3]) /
        step
      : 0
  )
  return secondDerivative
}

export function smooth(values: number[], radius: number) {
  // adapted from https://github.com/d3/d3-array/blob/main/src/blur.js
  const length = values.length
  const temp = [...values]
  const smoothed = [...values]
  blur(smoothed, temp, 0, length, 1, radius)

  return smoothed
}

function lls(data: number[]): number[] {
  return data.map((e) => Math.log(Math.log(Math.sqrt(e + 1) + 1) + 1))
}

function ills(data: number[]): number[] {
  return data.map(
    (e) => Math.exp(-2 + Math.exp(e)) * (-2 * Math.E + Math.exp(Math.exp(e)))
  )
}

function clip(x: number, min: number, max: number): number {
  return Math.max(min, Math.min(x, max))
}

export function peakDetect(data: number[], x: number[]): Peak[] {
  const y: number[] = [...data]
  const maxIntensity = Math.max(...y)
  const xStep = x[1] - x[0]

  const secondDerivative = smooth(calculateSecondDerivative(y, xStep), 3)
  const secondDerivativeMax = Math.max(...secondDerivative)

  const smoothedY = smooth(y, 2)

  const radius = 10

  const filteredDerivativeZeroes = x.map((_, i) => {
    if (i > radius) {
      const localAverage =
        smoothedY.slice(i - radius, i + radius).reduce((a, b) => a + b, 0) /
        (2 * radius + 1)
      const isPeak =
        smoothedY[i] > smoothedY[i + 1] &&
        smoothedY[i] > smoothedY[i - 1] &&
        smoothedY[i] >= 1.1 * localAverage
      const sharpness = -secondDerivative[i] / secondDerivativeMax
      if (isPeak && sharpness >= 0.02) {
        return {
          index: i,
          position: x[i]
        }
      }
    }
  })

  const peaks: Peak[] = filteredDerivativeZeroes
    .flatMap((peak) => {
      if (peak) {
        return {
          position: peak.position,
          positionIndex: peak.index,
          intensity: y[peak.index],
          relativeIntensity: y[peak.index] / maxIntensity
        }
      } else return []
    })
    .filter((e) => (e?.intensity ?? 0) >= 0.01 * maxIntensity)

  return peaks
}

export function removeBaseline(data: ParsedData): number[] {
  let y: number[] = lls([...data.y])

  const w = 25
  const m = Math.floor((w - 1) / 2)

  for (let p = 2; p < m; p++) {
    for (let i = 0; i < y.length - m; i++) {
      if (i - p < 0) continue
      y[i] = Math.min(y[i], 0.5 * (y[i + p] + y[i - p]))
    }
  }

  y = ills(y)
  y = y.map((e, i) => clip(data.y[i] - e, -Infinity, Infinity))

  return y
}

export const groupBy = <T>(
  array: T[],
  predicate: (value: T, index: number, array: T[]) => string
) =>
  array.reduce((acc, value, index, array) => {
    ;(acc[predicate(value, index, array)] ||= []).push(value)
    return acc
  }, {} as { [key: string]: T[] })
