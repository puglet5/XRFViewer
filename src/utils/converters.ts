import { emissionLinesData } from "../data/elementData"
import { emissionLinePlotData, emissionLinePlotLabels } from "../data/emissionLinePlotData"
import { ScatterData } from "plotly.js"

interface ParsedData {
  x: number[] | undefined
  y: number[] | undefined
}

const generateLinspace = (startValue: number, stopValue: number, cardinality: number) => {
  let arr = []
  let step = (stopValue - startValue) / (cardinality - 1)
  for (let i = 0; i < cardinality; i++) {
    arr.push(startValue + (step * i))
  }
  return arr
}

export const convertDat = (rawData: string): ParsedData => {
  const parsedData: string[] = rawData.split("\n").map(e => e.trim())
  const hasHeaderString: boolean = parsedData[0].split(" ").length === 2
  if (!hasHeaderString) return { x: undefined, y: undefined }

  const lineCount: number = parsedData.filter(item => item).length - 1
  const xRange: [number, number] = [0, 40]
  const xLinspace: number[] = generateLinspace(...xRange, lineCount)

  const plotData = {
    x: xLinspace,
    y: parsedData.flatMap((e, i) => { return i >= 2 ? parseFloat(e.trim()) : [] })
  }

  return plotData
}

export const constructXRFData = (parsedData: ParsedData, name: string): Partial<ScatterData> => {
  return {
    x: parsedData.x,
    y: parsedData.y,
    type: "scatter",
    mode: "lines",
    name: name,
  }
}

export const constructElementData = (atomicNumbers: number[], scaleFactor: number): Partial<ScatterData>[] => {
  let elementIndices = atomicNumbers.map((e) => emissionLinesData.elements.findIndex(x => x.atomicNumber === e)).filter((e) => e >= 0)

  let elements = elementIndices.map((i) => emissionLinesData.elements[i])


  let plotData = elementIndices.flatMap((e, i) => {
    let lineData = emissionLinePlotData[e]
    let text = lineData.x.map((x, pos) => {
      if (pos % 3 - 1 === 0) {
        let label = emissionLinePlotLabels[e][(pos - 1) / 3].split(" ")
        if (!label[1]) {
          return `${x.toFixed(2).toString()} ${elements[i].symbol} (${label[0]})`
        } else {
          return `${x.toFixed(2).toString()} ${elements[i].symbol} (${label[0]}<sub>${label[1]}</sub>)`
        }
      } else { return "" }
    })
    return {
      x: lineData.x,
      y: lineData.y.map(e => e * scaleFactor),
      type: "scatter",
      mode: "lines",
      hoverinfo: "text",
      fill: "none",
      name: elements[i].symbol,
      text: text,
    }
  })

  if (!plotData.length) return []
  return plotData as Partial<ScatterData>[]
}

export const calculateElementDataScaleFactor = (XRFData: Partial<ScatterData>[]): number => {
  let data = XRFData.flatMap(e => e.y as any).filter(e => e)
  if (!data || !data.length) { return 1 }
  let scaleFactor = Math.max(...data as number[])
  return scaleFactor / 2
}
