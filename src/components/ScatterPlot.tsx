import Plotly, { Config, Layout, PlotMouseEvent, ScatterData } from 'plotly.js-basic-dist-min'
import { elementSymbols } from '@/data/elementData'
import { useRef, useState } from 'react'
import html2canvas from 'html2canvas'
import { IconDeviceFloppy, IconCopy, IconTags, IconVector, IconVectorOff, IconTag, IconTagsOff } from '@tabler/icons-react'
import { emissionLinePlotData } from '@/data/emissionLinePlotData'

import createPlotlyComponent from 'react-plotly.js/factory';
const Plot = createPlotlyComponent(Plotly);

interface Props {
  plotData: Partial<ScatterData>[]
  elementData: Partial<ScatterData>[]
  updateElementData: React.Dispatch<React.SetStateAction<Partial<ScatterData>[]>>
  selectedPoints: (number | undefined)[][]
  updateSelectedPoints: React.Dispatch<React.SetStateAction<(number | undefined)[][]>>
}

const config: Partial<Config> = {
  showTips: false,
  scrollZoom: true,
  displaylogo: false,
  modeBarButtonsToRemove: ['zoom2d', "autoScale2d", "lasso2d", "select2d", "zoomIn2d", "zoomOut2d", "pan2d", "resetScale2d"],
  modeBarButtonsToAdd: ["hoverclosest", "hovercompare"],
  responsive: true,
  displayModeBar: false,
  toImageButtonOptions: {
    format: 'png',
    filename: 'XRFViewer_data',
    scale: 4,
  },
  doubleClick: "reset+autosize",
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
    xanchor: 'right',
    x: 0.99,
    y: 0.99,
  },
  xaxis: {
    showgrid: true,
    zeroline: true,
    showline: true,
    mirror: 'ticks',
    title: {
      text: "Energy, keV"
    }
  },
  yaxis: {
    showgrid: true,
    zeroline: true,
    showline: true,
    mirror: 'ticks',
    title: {
      text: "Intensity, cnts."
    },
    exponentformat: "none",
    showexponent: 'all'
  },
  modebar: {
    orientation: "h"
  },
  font: { family: "FiraCode", color: "black" },
  hidesources: true,
  hoverlabel: {
    font: {
      size: 9
    },
  }
}

export default function ScatterPlot(
  {
    plotData,
    elementData,
    updateElementData,
    selectedPoints,
    updateSelectedPoints,
  }: Props) {
  const [lineLabelsVisibility, setLineLabelsVisibility] = useState<boolean>(!!JSON.parse(localStorage.getItem("lineLabelsVisibility")!))
  const [interpolationMode, setInterpolationMode] = useState<boolean>(false)

  const toggleLineHoverLabels = () => {
    const elementDataIndices = plotData.flatMap((e, i) => elementSymbols.includes(e.name!) ? i : [])
    if (!lineLabelsVisibility) {
      const allHoverPoints = elementDataIndices.flatMap((e) => {
        const trace = e
        const points: number[][] = (plotData[e] as any).selectedpoints as number[][]
        const hoverPoints = points.map((e: number[]) => { return { curveNumber: trace, pointNumber: e } })
        return hoverPoints
      });

      (Plotly as any).Fx.hover("plotMain", allHoverPoints)
      try {
        (Plotly as any).restyle("plotMain", { selected: { marker: { opacity: 0 } } })
      } catch (TypeError) {
        console.log("Caught plotly restyle TypeError")
      }
    } else {
      try {
        (Plotly as any).restyle("plotMain", { selected: { marker: { opacity: 1 } } })
      } catch (TypeError) {
        console.log("Caught plotly restyle TypeError")
      }
      (Plotly as any).Fx.hover("plotMain", [])
    }
    setLineLabelsVisibility(!lineLabelsVisibility)
    localStorage.setItem("lineLabelsVisibility", JSON.stringify(true))
  }

  const selectPoints = (data: Readonly<PlotMouseEvent>) => {
    const traceName: string = (data.points[0] as any).fullData.name
    if (!elementSymbols.includes(traceName)) { return }
    const point = data.points[0].pointIndex
    const trace = data.points[0].curveNumber
    const elementIndex = elementSymbols.indexOf(traceName)
    const pointsToUpdate = selectedPoints

    if (!pointsToUpdate[elementIndex].includes(point)) {
      pointsToUpdate[elementIndex] = [...pointsToUpdate[elementIndex], point]
      updateSelectedPoints([...pointsToUpdate])
    } else {
      pointsToUpdate[elementIndex] = pointsToUpdate[elementIndex].filter(e => e != point)
      updateSelectedPoints([...pointsToUpdate])
    }
    localStorage.setItem("selectedElementPoints", JSON.stringify(pointsToUpdate))
  }

  const resetLineLabelVisibility = () => {
    if (JSON.parse(localStorage.getItem("lineLabelsVisibility")!)) {
      try {
        (Plotly as any).restyle("plotMain", { selected: { marker: { opacity: 1 } } })
      } catch (TypeError) {
        console.log("Plotly restyle TypeError")
      }
    }
    setLineLabelsVisibility(false)
    localStorage.setItem("lineLabelsVisibility", JSON.stringify(false))
  }

  const savePlotImage = () => {
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

  const copyPlotImage = () => {
    const plotDiv = document.getElementById("plotMain")!
    html2canvas(plotDiv).then(canvas => canvas.toBlob(blob => navigator.clipboard.write(
      [new ClipboardItem({ 'image/png': blob! })]
    ), "image/png", 1))
  }

  const resetPointSelection = () => {
    const emptyEmissionLineData = Array.from({ length: emissionLinePlotData.length }, () => [])
    localStorage.setItem("selectedElementPoints", JSON.stringify(emptyEmissionLineData))
    updateSelectedPoints(emptyEmissionLineData)
  }

  const toggleInterpolation = () => {
    const interpolationShape = interpolationMode ? "linear" : "spline"
    Plotly.restyle("plotMain", { line: { shape: interpolationShape } })
    setInterpolationMode(!interpolationMode)
  }

  return (
    <>
      <div id="plotControls" className='z-20 pl-10 text-acc border-b w-full flex space-x-1 p-3 border-ptx'>
        <button
          onClick={toggleLineHoverLabels}
          title='Toggle emission line labels'
          className={selectedPoints.flat().length ? "" : "!text-gray-300"}
          disabled={selectedPoints.flat().length ? false : true}
        >
          {
            !lineLabelsVisibility ?
              <IconTags></IconTags> :
              <IconTagsOff></IconTagsOff>
          }
        </button>
        <button
          onClick={resetPointSelection}
          title='Reset point selection'
          className={selectedPoints.flat().length ? "" : "!text-gray-300"}
          disabled={selectedPoints.flat().length ? false : true}
        >
          <IconTag></IconTag>
        </button>
        <button
          onClick={savePlotImage}
          title='Save plot as .png'
          className={plotData.flat().length ? "" : "!text-gray-300"}
          disabled={plotData.flat().length ? false : true}
        >
          <IconDeviceFloppy></IconDeviceFloppy>
        </button>
        <button
          onClick={copyPlotImage}
          title='Copy to clipboard'
          className={plotData.flat().length ? "" : "!text-gray-300"}
          disabled={plotData.flat().length ? false : true}
        >
          <IconCopy></IconCopy>
        </button>
        <button
          onClick={toggleInterpolation}
          title='Toggle interpolation'
          className={plotData.flat().length ? "" : "!text-gray-300"}
          disabled={plotData.flat().length ? false : true}
        >
          {
            !interpolationMode ?
              <IconVector></IconVector> :
              <IconVectorOff></IconVectorOff>
          }
        </button>
      </div>
      <Plot
        divId='plotMain'
        data={plotData}
        layout={layout}
        config={config}
        className='w-full h-[calc(100vh-3rem)]'
        onClick={selectPoints}
        onHover={resetLineLabelVisibility}
      />
    </>
  )
}
