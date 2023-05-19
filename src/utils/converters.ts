import { Point } from "./interfaces"
import { ChartData } from "chart.js"
import { emissionLinesData } from "../data/elementData"
import { emissionLinePlotData } from "../data/emissionLinePlotData"

const generateLinspace = (startValue: number, stopValue: number, cardinality: number) => {
  let arr = []
  let step = (stopValue - startValue) / (cardinality - 1)
  for (let i = 0; i < cardinality; i++) {
    arr.push(startValue + (step * i))
  }
  return arr
}

export const convertDat = (rawData: string): Point[] | null => {
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

export const constructPlotData = (...args: ChartData<"scatter">[]): ChartData<"scatter"> => {
  let plotData = {
    datasets: args.flatMap((e) => e.datasets)
  }
  return plotData
}

export const constructElementData = (atomicNumbers: number[], scaleFactor: number): ChartData<"scatter"> => {
  let elementIndices = atomicNumbers.map((e) => emissionLinesData.elements.findIndex(x => x.atomicNumber === e)).filter((e) => e >= 0)

  let elements = elementIndices.map((i) => emissionLinesData.elements[i])

  let plotData = {
    datasets: elementIndices.flatMap((e, i) => {
      let yData = emissionLinePlotData[e].map(e => e["y"] * scaleFactor)
      let data = emissionLinePlotData[e].map((e, i) => (
        {
          x: e["x"],
          y: yData[i],
        }
      ))
      return {
        showLine: true,
        label: elements[i].symbol,
        pointRadius: 0,
        pointHoverRadius: 0,
        pointHitRadius: 0,
        data: data,
        datalabels: {
          anchor: "center",
          align: "top",
          clip: true,
          borderRadius: 2,
          backgroundColor: "rgba(255, 255, 255, .75)",
          labels: {
            value: {},
            title: {
              color: "black",
            }
          },
          display: (context: any) => {
            if (context.dataIndex % 3 - 1 === 0)
              return "auto"
            else
              return false
          },
          formatter: (value: any) => {
            let label = parseFloat(value["x"]).toFixed(2)
            return label
          }
        },
      }
    })
  }

  if (!plotData.datasets.length) return { datasets: [] }
  return plotData as ChartData<"scatter">
}

export const calculateElementDataScaleFactor = (XRFData: ChartData<"scatter">): number => {
  let data = XRFData.datasets.map(e => e.data.map((e) => (e as Point)["y"]))
  if (!data.length) { return 1 }
  let scaleFactor = Math.max.apply(null, data.flat(1))
  return scaleFactor / 2
}
