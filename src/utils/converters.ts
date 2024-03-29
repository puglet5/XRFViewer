import { ScatterData } from "plotly.js"
import {
  ElementSymbol,
  ParsedData,
  ValidFileType,
  elementSymbols,
  isValidFileType
} from "../common/interfaces"
import {
  emissionLinePlotData,
  emissionLinePlotLabels
} from "../data/elementData"

type ProcessByFileTypeTable = {
  [T in ValidFileType]: {
    parse: (data: string) => ParsedData
    validate: (data: string) => boolean
  }
}

const parseTable: ProcessByFileTypeTable = {
  ".dat": { parse: parseDat, validate: validateDat },
  ".csv": { parse: parseCsv, validate: validateCsv },
  ".txt": { parse: parseTxt, validate: validateTxt }
} as const

function parseTxt(data: string): ParsedData {
  // 0                  channelCount
  // 1::channelCount    channels
  // channelCount+1::-1 metadata

  const parsedData: string[] = data
    .split("\n")
    .map((e) => e.trim())
    .filter((e) => e ?? "0")

  const channelCount: number = +parsedData[0]
  const xRange: [number, number] = [0, 40]
  const xLinspace: number[] = generateLinspace(...xRange, channelCount)
  const metadata = parsedData.slice(1 + channelCount, -1)

  const plotData = {
    x: xLinspace,
    y: parsedData
      .flatMap((e, i) => {
        return i >= 1 ? parseFloat(e.trim()) : []
      })
      .slice(0, channelCount)
  }

  return plotData
}

function validateTxt(data: string): boolean {
  const parsedData: string[] = data
    .split("\n")
    .map((e) => e.trim())
    .filter((e) => e ?? "0")
  const hasHeaderString: boolean = parsedData[0].split(" ").length === 1
  const bodyData = parsedData.slice(1, +parsedData[0])
  const hasValidFormat: boolean =
    hasHeaderString &&
    bodyData.every((e) => typeof e === "string") &&
    !bodyData.map((e) => +e).includes(NaN)

  return hasValidFormat
}

function generateLinspace(
  startValue: number,
  stopValue: number,
  cardinality: number
) {
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
      return i >= 1 ? parseFloat(e.trim()) : []
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
        .map((e) => +e ?? "0")
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
    !bodyData.map((e) => +e).includes(NaN)

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
        .map((e) => +e ?? "0")
    )

  const hasTwoColumns: boolean = parsedData
    .map((e) => e.length === 2)
    .every((e) => e === true)

  return hasTwoColumns
}

export function convertData(data: string, fileType: string): ParsedData | null {
  if (isValidFileType(fileType)) {
    return parseTable[fileType as ValidFileType].validate(data)
      ? parseTable[fileType as ValidFileType].parse(data)
      : null
  }
  return null
}

export function constructXRFData(
  parsedData: ParsedData,
  name: string
): Partial<ScatterData> {
  return {
    x: parsedData.x,
    y: parsedData.y,
    type: "scattergl",
    mode: "text+lines",
    line: { simplify: true },
    textposition: "top center",
    selectedpoints: [],
    name
  }
}

export function sortElementDataByAtomicNumber(
  a: Partial<ScatterData>,
  b: Partial<ScatterData>
) {
  if (a.name && b.name) {
    if (
      elementSymbols.indexOf(a.name as ElementSymbol) <
      elementSymbols.indexOf(b.name as ElementSymbol)
    ) {
      return -1
    }
    if (
      elementSymbols.indexOf(a.name as ElementSymbol) <
      elementSymbols.indexOf(b.name as ElementSymbol)
    ) {
      return 1
    }
    return 0
  } else return 0
}

export function constructElementData(
  atomicNumbers: number[],
  scaleFactor: number
): Partial<ScatterData>[] {
  const plotData = atomicNumbers.map((e) => {
    const lineData = emissionLinePlotData[e]
    if (lineData === undefined) return {}
    const x = lineData.x
    const y = lineData.y.map((e) => e * scaleFactor)
    const text = lineData.x.map((x, pos) => {
      if ((pos % 3) - 1 === 0) {
        const label = emissionLinePlotLabels[e][(pos - 1) / 3].split(" ")
        if (!label[1]) {
          return `${x.toFixed(2).toString()} ${elementSymbols[e]} (${label[0]})`
        } else {
          return `${x.toFixed(2).toString()} ${elementSymbols[e]} (${
            label[0]
          }<sub>${label[1]}</sub>)`
        }
      } else {
        return ""
      }
    })

    const meta = {
      annotations: text.flatMap((e, i) => {
        if (e) {
          return {
            text: e,
            ax: 0,
            x: x[i],
            y: y[i],
            showarrow: true,
            arrowhead: 3,
            arrowside: "end",
            arrowsize: 0.5,
            visible: false,
            clicktoshow: "onoff",
            align: "center",
            opacity: 1,
            bgcolor: "rgba(255,255,255,1)",
            bordercolor: "rgba(0,0,0,1)",
            arrowwidth: 0.5
          }
        } else return []
      })
    }

    return {
      x,
      y,
      type: "scattergl",
      mode: "lines",
      hoverinfo: "text",
      meta: meta,
      fill: "none",
      line: { width: 1, simplify: true },
      name: elementSymbols[e],
      text: text
    }
  })

  return plotData as Partial<ScatterData>[]
}

export function calculateElementDataScaleFactor(data: number[][]): number {
  const y = data.flat()
  if (y.length) {
    return Math.max(...y) * 0.8
  } else return 1
}
