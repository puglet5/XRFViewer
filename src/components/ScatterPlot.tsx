import Plot from 'react-plotly.js'
import Plotly, { Config, Layout, PlotMouseEvent, ScatterData } from 'plotly.js'
import { elementSymbols } from '@/data/elementData'
import { useEffect, useRef, useState } from 'react'
import { sortElementDataByAtomicNumber } from '@/utils/converters'
import html2canvas from 'html2canvas'
import { IconDeviceFloppy, IconCopy, IconTags } from '@tabler/icons-react'

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
  hidesources: true,
  hoverdistance: -1
}

const style = {
  height: "100%"
}

export default function ScatterPlot(
  {
    plotData,
    elementData,
    updateElementData,
    selectedPoints,
    updateSelectedPoints,
  }: Props) {
  const mainPlot = useRef(null)
  const [lineLabelsVisibility, setLineLabelsVisibility] = useState<boolean>(!!JSON.parse(localStorage.getItem("lineLabelsVisibility")!))

  const toggleLineHoverLabels = () => {
    const elementDataIndices = plotData.flatMap((e, i) => elementSymbols.includes(e.name!) ? i : [])
    if (!lineLabelsVisibility) {
      const allHoverPoints = elementDataIndices.flatMap((e) => {
        const trace = e
        const points = plotData[e].selectedpoints
        // @ts-ignore
        const hoverPoints = points.map((e: number[]) => { return { curveNumber: trace, pointNumber: e } })
        return hoverPoints
      })

      // @ts-ignore
      Plotly.Fx.hover("plotMain", allHoverPoints)
      try {
        // @ts-ignore
        Plotly.restyle("plotMain", { selected: { marker: { opacity: 0 } } })
      } catch (TypeError) {
        console.log("Caught plotly restyle TypeError")
      }
    } else {
      try {
        // @ts-ignore
        Plotly.restyle("plotMain", { selected: { marker: { opacity: 1 } } })
      } catch (TypeError) {
        console.log("Caught plotly restyle TypeError")
      }
      // @ts-ignore
      Plotly.Fx.hover("plotMain", [])
    }
    setLineLabelsVisibility(!lineLabelsVisibility)
    localStorage.setItem("lineLabelsVisibility", JSON.stringify(true))
  }

  const selectPoints = (data: Readonly<PlotMouseEvent>) => {
    // @ts-ignore
    const traceName: string = data.points[0].fullData.name
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
        // @ts-ignore
        Plotly.restyle("plotMain", { selected: { marker: { opacity: 1 } } })
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
    )))
  }

  return (
    <>
      <button onClick={toggleLineHoverLabels}>
        <IconTags></IconTags>
      </button>
      <button onClick={savePlotImage}>
        <IconDeviceFloppy></IconDeviceFloppy>
      </button>
      <button onClick={copyPlotImage}>
        <IconCopy></IconCopy>
      </button>
      <Plot
        ref={mainPlot}
        style={style}
        divId='plotMain'
        data={plotData}
        layout={layout}
        config={config}
        onClick={selectPoints}
        onHover={resetLineLabelVisibility}
      />
    </>
  )
}
