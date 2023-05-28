import { Peak } from "./interfaces"
import { ParsedData } from "./interfaces"

const bluri = (radius: number) => {
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

export const smooth = (values: number[], radius: number) => {
  // adapted from https://github.com/d3/d3-array/blob/main/src/blur.js
  const length = values.length
  if (!length || !radius) return values
  const blur = bluri(radius)
  const temp = [...values]
  blur(values, temp, 0, length, 1)
  blur(temp, values, 0, length, 1)
  blur(values, temp, 0, length, 1)
  return values
}

const calculateFirstDerivative = (data: number[], step: number) => {
  const [a, b, c, d] = [11 / 6, 3, 1.5, 1 / 3]
  const firstDerivative = data.flatMap((e, i) =>
    i < data.length - 4
      ? (-a * data[i] + b * data[i + 1] - c * data[i + 2] + d * data[i + 3]) /
        step
      : 0
  )
  return smooth(firstDerivative, 3)
}

export const findPeaks = (data: ParsedData): Peak[] => {
  const x: number[] = [...data.x]
  const y: number[] = [...data.y]
  const maxIntensity = Math.max(...y)
  const xStep = x[1] - x[0]

  const firstDerivative = calculateFirstDerivative(y, xStep)

  const radius = 6
  const filteredDerivativeZeroes = firstDerivative.map((_, i) => {
    if (i > radius) {
      if (firstDerivative[i] >= 0 && firstDerivative[i + 1] < 0) {
        const localPoints = y.slice(i - radius, i + radius)
        const localAverage =
          localPoints.reduce((a, b) => a + b) / (2 * radius + 1)
        if (y[i] >= 1.2 * localAverage) {
          const maxIndex = localPoints.findIndex(
            (e) => e === Math.max(...localPoints)
          )
          return {
            index: i + maxIndex - radius,
            position: x[i + maxIndex - radius]
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
    .filter((e) => (e?.intensity ?? 0) >= 0.01 * maxIntensity)

  return peaks
}
