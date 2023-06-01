import Plotly, {
  Config,
  Layout,
  PlotMouseEvent,
  ScatterData
} from "plotly.js-basic-dist-min"
import { elementSymbols } from "@/data/elementData"
import { useEffect, useRef, useState } from "react"
import html2canvas from "html2canvas"
import {
  IconDeviceFloppy,
  IconCopy,
  IconTags,
  IconVector,
  IconVectorOff,
  IconTag,
  IconTagsOff,
  IconTriangle,
  IconTriangleOff
} from "@tabler/icons-react"
import { emissionLinePlotData } from "@/data/emissionLinePlotData"

import createPlotlyComponent from "react-plotly.js/factory"
import { Peak, PeakData } from "@/common/interfaces"

interface Props {
  plotData: Partial<ScatterData>[]
  elementData: Partial<ScatterData>[]
  updateElementData: React.Dispatch<
    React.SetStateAction<Partial<ScatterData>[]>
  >
  selectedPoints: (number | undefined)[][]
  updateSelectedPoints: React.Dispatch<
    React.SetStateAction<(number | undefined)[][]>
  >
  peakData: PeakData
  currentModifiedData: Partial<ScatterData>[]
  currentXRFData: Partial<ScatterData>[]
  plotRevision: number
}

const Plot = createPlotlyComponent(Plotly)

const config: Partial<Config> = {
  showTips: false,
  editable: true,
  scrollZoom: true,
  displaylogo: false,
  modeBarButtonsToRemove: [
    "zoom2d",
    "autoScale2d",
    "lasso2d",
    "select2d",
    "zoomIn2d",
    "zoomOut2d",
    "pan2d",
    "resetScale2d"
  ],
  modeBarButtonsToAdd: ["hoverclosest", "hovercompare"],
  responsive: true,
  displayModeBar: false,
  toImageButtonOptions: {
    format: "png",
    filename: "XRFViewer_data",
    scale: 4
  },
  doubleClick: "reset+autosize"
}

const layout: Partial<Layout> = {
  margin: {
    l: 100,
    r: 20,
    b: 60,
    t: 10,
    pad: 0
  },
  title: "",
  showlegend: true,
  autosize: true,
  dragmode: "pan",
  legend: {
    itemdoubleclick: false,
    borderwidth: 1,
    xanchor: "right",
    x: 0.99,
    y: 0.99
  },
  xaxis: {
    showgrid: true,
    zeroline: true,
    showline: true,
    mirror: "ticks",
    title: {
      text: "Energy, keV"
    },
    hoverformat: ".2f"
  },
  yaxis: {
    showgrid: true,
    zeroline: true,
    showline: true,
    mirror: "ticks",
    title: {
      text: "Intensity, cnts."
    },
    exponentformat: "none",
    showexponent: "all",
    hoverformat: ".0f"
  },
  modebar: {
    orientation: "h"
  },
  font: { family: "FiraCode", color: "black" },
  hoverlabel: {
    font: {
      size: 12
    }
  }
}

export default function ScatterPlot({
  plotData,
  selectedPoints,
  updateSelectedPoints,
  plotRevision,
  peakData
}: Props) {
  const [lineLabelsVisibility, setLineLabelsVisibility] = useState<boolean>(
    !!JSON.parse(localStorage.getItem("lineLabelsVisibility")!)
  )
  const [interpolationMode, setInterpolationMode] = useState<boolean>(false)
  const [textVisibility, setTextVisibility] = useState<boolean>(false)

  const dragLayerRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    let annotations
    if (peakData.modified.length) {
      annotations = peakData.modified[0].map((e) => {
        return {
          ax: 0,
          x: e.position,
          y: e.intensity,
          xref: "x",
          yref: "y",
          xanchor: "center",
          yanchor: "center",
          showarrow: true,
          arrowhead: 7,
          arrowside: "end",
          arrowsize: 0.5,
          align: "center",
          opacity: 0.8,
          text: e.position.toFixed(2).toString()
        }
      })
    }

    console.log(annotations)
    try {
      //@ts-expect-error
      Plotly.relayout("plotMain", { annotations: annotations })
    } catch (error) {}
  }, [peakData])

  function toggleLineHoverLabels() {
    const elementDataIndices = plotData.flatMap((e, i) =>
      elementSymbols.includes(e.name!) ? i : []
    )
    if (!lineLabelsVisibility) {
      const allHoverPoints = elementDataIndices.flatMap((e) => {
        const trace = e
        const points: number[][] = (plotData[e] as any)
          .selectedpoints as number[][]
        const hoverPoints = points.map((e: number[]) => {
          return { curveNumber: trace, pointNumber: e }
        })
        return hoverPoints
      })
      ;(Plotly as any).Fx.hover("plotMain", allHoverPoints)
      try {
        ;(Plotly as any).restyle("plotMain", {
          selected: { marker: { opacity: 0 } }
        })
      } catch (TypeError) {
        console.warn("Caught plotly restyle TypeError")
      }
    } else {
      try {
        ;(Plotly as any).restyle("plotMain", {
          selected: { marker: { opacity: 1 } }
        })
      } catch (TypeError) {
        console.warn("Caught plotly restyle TypeError")
      }
      ;(Plotly as any).Fx.hover("plotMain", [])
    }
    setLineLabelsVisibility(!lineLabelsVisibility)
    localStorage.setItem("lineLabelsVisibility", JSON.stringify(true))
  }

  function selectPoints(data: Readonly<PlotMouseEvent>) {
    const traceName: string = (data.points[0] as any).fullData.name
    if (!elementSymbols.includes(traceName)) {
      return
    }
    const point = data.points[0].pointIndex
    const elementIndex = elementSymbols.indexOf(traceName)
    const pointsToUpdate = selectedPoints

    if (!pointsToUpdate[elementIndex].includes(point)) {
      pointsToUpdate[elementIndex] = [...pointsToUpdate[elementIndex], point]
      updateSelectedPoints([...pointsToUpdate])
    } else {
      pointsToUpdate[elementIndex] = pointsToUpdate[elementIndex].filter(
        (e) => e != point
      )
      updateSelectedPoints([...pointsToUpdate])
    }
    localStorage.setItem(
      "selectedElementPoints",
      JSON.stringify(pointsToUpdate)
    )
  }

  function resetLineLabelVisibility() {
    if (JSON.parse(localStorage.getItem("lineLabelsVisibility")!)) {
      try {
        ;(Plotly as any).restyle("plotMain", {
          selected: { marker: { opacity: 1 } }
        })
      } catch (TypeError) {
        console.warn("Caught Plotly restyle TypeError")
      }
    }
    setLineLabelsVisibility(false)
    localStorage.setItem("lineLabelsVisibility", JSON.stringify(false))
  }

  function savePlotImage() {
    const plotDiv = document.getElementById("plotMain")!
    html2canvas(plotDiv).then((canvas) => {
      const url = canvas.toDataURL()
      const a = document.createElement("a")
      a.download = "XRFViewer_data"
      a.href = url
      document.body.appendChild(a)
      a.click()
    })
  }

  function copyPlotImage() {
    const plotDiv = document.getElementById("plotMain")!
    html2canvas(plotDiv).then((canvas) =>
      canvas.toBlob(
        (blob) =>
          navigator.clipboard.write([
            new ClipboardItem({ "image/png": blob! })
          ]),
        "image/png",
        1
      )
    )
  }

  function resetPointSelection() {
    const emptyEmissionLineData = Array.from(
      { length: emissionLinePlotData.length },
      () => []
    )
    localStorage.setItem(
      "selectedElementPoints",
      JSON.stringify(emptyEmissionLineData)
    )
    updateSelectedPoints(emptyEmissionLineData)
  }

  function toggleInterpolation() {
    const interpolationShape = interpolationMode ? "linear" : "spline"
    try {
      Plotly.restyle("plotMain", { line: { shape: interpolationShape } })
    } catch (TypeError) {
      console.warn("Caught Plotly restyle error")
    }
    setInterpolationMode(!interpolationMode)
  }

  function toggleTextVisibility() {
    const traceMode = !textVisibility ? "text+lines" : "lines"

    const traceIndices = plotData.flatMap((e, i) => {
      if (!elementSymbols.includes(e.name!)) {
        return i
      } else return []
    })
    try {
      Plotly.restyle("plotMain", { mode: traceMode }, traceIndices)
    } catch (TypeError) {
      console.warn("Caught Plotly restyle error")
    }

    setTextVisibility(!textVisibility)
  }

  return (
    <>
      <div
        id="plotControls"
        className="sticky z-20 flex w-full space-x-1 border-b border-ptx p-3 text-acc"
      >
        <button
          onClick={toggleLineHoverLabels}
          title="Toggle emission line labels"
          className={selectedPoints.flat().length ? "" : "!text-gray-300"}
          disabled={selectedPoints.flat().length ? false : true}
        >
          {!lineLabelsVisibility ? (
            <IconTags></IconTags>
          ) : (
            <IconTagsOff></IconTagsOff>
          )}
        </button>
        <button
          onClick={resetPointSelection}
          title="Reset point selection"
          className={selectedPoints.flat().length ? "" : "!text-gray-300"}
          disabled={selectedPoints.flat().length ? false : true}
        >
          <IconTag></IconTag>
        </button>

        <button
          onClick={savePlotImage}
          title="Save plot as .png"
          className={plotData.flat().length ? "" : "!text-gray-300"}
          disabled={plotData.flat().length ? false : true}
        >
          <IconDeviceFloppy></IconDeviceFloppy>
        </button>
        <button
          onClick={copyPlotImage}
          title="Copy plot image to clipboard"
          className={plotData.flat().length ? "" : "!text-gray-300"}
          disabled={plotData.flat().length ? false : true}
        >
          <IconCopy></IconCopy>
        </button>
        <button
          onClick={toggleInterpolation}
          title={
            !interpolationMode
              ? "Enable interpolation"
              : "Disable interpolation"
          }
          className={plotData.flat().length ? "" : "!text-gray-300"}
          disabled={plotData.flat().length ? false : true}
        >
          {!interpolationMode ? (
            <IconVector></IconVector>
          ) : (
            <IconVectorOff></IconVectorOff>
          )}
        </button>
      </div>
      <Plot
        divId="plotMain"
        data={plotData}
        layout={layout}
        config={config}
        className="h-[calc(100vh-3rem)] w-full"
        style={{ clipPath: "none" }}
        onClick={function (data) {
          selectPoints(data)
        }}
        onInitialized={function () {
          dragLayerRef.current = document.querySelector(
            ".draglayer"
          ) as HTMLElement
          dragLayerRef.current.classList.add("!cursor-pointer")
        }}
        onHover={function (data) {
          resetLineLabelVisibility()
        }}
        revision={plotRevision}
      />
    </>
  )
}
