import { Peak } from "../common/interfaces"
import { ParsedData } from "../common/interfaces"

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

function calculateFirstDerivative(data: number[], step: number) {
  const [a, b, c, d] = [11 / 6, 3, 1.5, 1 / 3]
  const firstDerivative = data.flatMap((e, i) =>
    i < data.length - 4
      ? (-a * data[i] + b * data[i + 1] - c * data[i + 2] + d * data[i + 3]) /
        step
      : 0
  )
  return firstDerivative
}

export function smooth(values: number[], radius: number) {
  // adapted from https://github.com/d3/d3-array/blob/main/src/blur.js
  const length = values.length
  const blur = bluri(radius)
  const temp = [...values]
  blur(values, temp, 0, length, 1)
  blur(temp, values, 0, length, 1)
  blur(values, temp, 0, length, 1)
  return values
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

export function peakDetect(data: ParsedData): Peak[] {
  const x: number[] = [...data.x]
  const y: number[] = [...data.y]
  const maxIntensity = Math.max(...y)
  const xStep = x[1] - x[0]

  const firstDerivative = smooth(calculateFirstDerivative(y, xStep), 1)

  const radius = 6

  const filteredDerivativeZeroes = x.map((_, i) => {
    if (i > radius) {
      if (firstDerivative[i] >= 0 && firstDerivative[i + 1] < 0) {
        const localPoints = y.slice(i - radius, i + radius)
        const localAverage =
          localPoints.reduce((a, b) => a + b) / (2 * radius + 1)
        if (y[i] >= 1.2 * localAverage) {
          return {
            index: i,
            position: x[i]
          }
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
    .filter((e) => (e?.intensity ?? 0) >= 0.001 * maxIntensity)

  return peaks
}

export function removeBaseline(data: ParsedData): number[1] {
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
