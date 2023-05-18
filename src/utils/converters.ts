import { Point } from "./interfaces"

const generateLinspace = (startValue: number, stopValue: number, cardinality: number) => {
  let arr = []
  let step = (stopValue - startValue) / (cardinality - 1)
  for (let i = 0; i < cardinality; i++) {
    arr.push(startValue + (step * i))
  }
  return arr
}

export default function convertDat(rawData: string): Point[] | null {
  const parsedData: string[] = rawData.split("\n").map(e => e.trim())
  const hasHeaderString: boolean = parsedData[0].split(" ").length === 2
  if (!hasHeaderString) return null

  const lineCount: number = parsedData.filter(item => item).length - 1
  const xRange: [number, number] = [0, 40]
  const xLinspace: number[] = generateLinspace(...xRange, lineCount)

  const plotData: Point[] = xLinspace
    .flatMap((e, i) => i >= 2 ? [[e, parseFloat(parsedData[i].trim())]] : [])
    .filter(item => item)
    .map((v) => {
      let [x, y] = v
      return { x, y }
    })

  return plotData
}
