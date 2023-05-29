import { elementSymbols, emissionLinesData } from "../data/elementData"
import {
  emissionLinePlotData,
  emissionLinePlotLabels
} from "../data/emissionLinePlotData"
import { ScatterData } from "plotly.js"
import { ParsedData, isValidFileType } from "../common/interfaces"
import { findPeaks } from "./processing"
import { ValidFileType } from "../common/interfaces"

type ProcessByFileTypeTable = {
  [T in ValidFileType]: {
    parse: (data: string) => ParsedData
    validate: (data: string) => boolean
  }
}

const parseTable: ProcessByFileTypeTable = {
  ".dat": { parse: parseDat, validate: validateDat },
  ".csv": { parse: parseCsv, validate: validateCsv }
} as const

const generateLinspace = (
  startValue: number,
  stopValue: number,
  cardinality: number
) => {
  const arr = []
  const step = (stopValue - startValue) / (cardinality - 1)
  for (let i = 0; i < cardinality; i++) {
    arr.push(startValue + step * i)
  }
  return arr
}

function parseDat(data: string): ParsedData {
  const parsedData: string[] = data
    .split("\n")
    .map((e) => e.trim())
    .filter((e) => e ?? "0")

  const lineCount: number = parsedData.filter((item) => item).length - 1
  const xRange: [number, number] = [0, 40]
  const xLinspace: number[] = generateLinspace(...xRange, lineCount)

  const plotData = {
    x: xLinspace,
    y: parsedData.flatMap((e, i) => {
      return i >= 2 ? parseFloat(e.trim()) : []
    })
  }
  return plotData
}

function parseCsv(data: string): ParsedData {
  const parsedData: number[][] = data
    .trim()
    .split("\n")
    .map((e) =>
      e
        .trim()
        .split(",")
        .map((e) => Number(e) ?? "0")
    )
  const transposedData = parsedData[0].map((col, i) =>
    parsedData.map((row) => row[i])
  )
  const plotData = {
    x: transposedData[0],
    y: transposedData[1]
  }

  return plotData
}

function validateDat(data: string): boolean {
  const parsedData: string[] = data
    .split("\n")
    .map((e) => e.trim())
    .filter((e) => e ?? "0")
  const hasHeaderString: boolean = parsedData[0].split(" ").length === 2
  const bodyData = parsedData.slice(1)
  const hasValidFormat: boolean =
    hasHeaderString &&
    bodyData.every((e) => typeof e === "string") &&
    !bodyData.map((e) => Number(e)).includes(NaN)

  return hasValidFormat
}

function validateCsv(data: string): boolean {
  const parsedData: number[][] = data
    .trim()
    .split("\n")
    .map((e) =>
      e
        .trim()
        .split(",")
        .map((e) => Number(e) ?? "0")
    )

  const hasTwoColumns: boolean = parsedData
    .map((e) => e.length === 2)
    .every((e) => e === true)

  return hasTwoColumns
}

export const convertData = (
  data: string,
  fileType: string
): ParsedData | null => {
  if (isValidFileType(fileType)) {
    return parseTable[fileType as ValidFileType].validate(data)
      ? parseTable[fileType as ValidFileType].parse(data)
      : null
  }
  return null
}

export const constructXRFData = (
  parsedData: ParsedData,
  name: string
): Partial<ScatterData> => {
  const peaks = findPeaks(parsedData)
  const peakIndices = peaks.map((e) => e.positionIndex)
  const text = parsedData.x.map((e, i) => {
    if (peakIndices.includes(i)) {
      return (
        peaks
          .find((e) => e.positionIndex === i)
          ?.position.toFixed(2)
          .toString() ?? ""
      )
    } else return ""
  })
  return {
    x: parsedData.x,
    y: parsedData.y,
    type: "scattergl",
    mode: "lines",
    textposition: "top center",
    hoverinfo: "x+y+name",
    name: name,
    text: text
  }
}

export const sortElementDataByAtomicNumber = (
  a: Partial<ScatterData>,
  b: Partial<ScatterData>
) => {
  if (a.name && b.name) {
    if (elementSymbols.indexOf(a.name) < elementSymbols.indexOf(b.name)) {
      return -1
    }
    if (elementSymbols.indexOf(a.name) < elementSymbols.indexOf(b.name)) {
      return 1
    }
    return 0
  } else return 0
}

export const constructElementData = (
  atomicNumbers: number[],
  scaleFactor: number,
  selectedPoints: (number | undefined)[][]
): Partial<ScatterData>[] => {
  const elementIndices = atomicNumbers
    .map((e) =>
      emissionLinesData.elements.findIndex((x) => x.atomicNumber === e)
    )
    .filter((e) => e >= 0)

  const elements = elementIndices.map((i) => emissionLinesData.elements[i])

  const plotData = elementIndices.flatMap((e, i) => {
    const lineData = emissionLinePlotData[e]
    const text = lineData.x.map((x, pos) => {
      if ((pos % 3) - 1 === 0) {
        const label = emissionLinePlotLabels[e][(pos - 1) / 3].split(" ")
        if (!label[1]) {
          return `${x.toFixed(2).toString()} ${elements[i].symbol} (${
            label[0]
          })`
        } else {
          return `${x.toFixed(2).toString()} ${elements[i].symbol} (${
            label[0]
          }<sub>${label[1]}</sub>)`
        }
      } else {
        return ""
      }
    })
    return {
      x: lineData.x,
      y: lineData.y.map((e) => e * scaleFactor),
      type: "scattergl",
      mode: "lines+markers",
      hoverinfo: "text",
      fill: "none",
      name: elements[i].symbol,
      text: text,
      selectedpoints: selectedPoints[e],
      unselected: {
        marker: {
          size: 0
        }
      }
    }
  })

  if (!plotData.length) return []
  return plotData as Partial<ScatterData>[]
}

export const calculateElementDataScaleFactor = (
  XRFData: Partial<ScatterData>[]
): number => {
  const data = XRFData.flatMap((e) => e.y as number[]).filter((e) => e)
  if (!data?.length) {
    return 1
  }
  const scaleFactor = Math.max(...data)
  return scaleFactor / 2
}
