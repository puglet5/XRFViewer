import Plot from 'react-plotly.js';
import Plotly, { Config, Layout, PlotMouseEvent, ScatterData } from 'plotly.js'
import { elementSymbols } from '@/data/elementData';
import { useRef } from 'react';
import { sortElementDataByAtomicNumber } from '@/utils/converters';

interface Props {
  plotData: Partial<ScatterData>[]
  elementData: Partial<ScatterData>[]
  updateElementData: React.Dispatch<React.SetStateAction<Partial<ScatterData>[]>>
}

const config: Partial<Config> = {
  showTips: false,
  scrollZoom: true,
  editable: false,
  displaylogo: false,
  modeBarButtonsToRemove: ['zoom2d', "autoScale2d", "lasso2d", "select2d", "zoomIn2d", "zoomOut2d", "pan2d", "resetScale2d"],
  modeBarButtonsToAdd: ["hoverclosest", "hovercompare"],
  responsive: true,
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
    t: 40,
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
    y: 0.99
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

export default function ScatterPlot({ plotData, elementData, updateElementData }: Props) {
  const mainPlot = useRef(null)
  const showLineHoverLabels = (data: Readonly<PlotMouseEvent>) => {
    const elementDataIndices = plotData.flatMap((e, i) => elementSymbols.includes(e.name!) ? i : [])
    const allHoverPoints = elementDataIndices.flatMap((e) => {
      const trace = e
      const points = plotData[e].selectedpoints
      // @ts-ignore
      const hoverPoints = points.map((e: number[]) => { return { curveNumber: trace, pointNumber: e } })
      return hoverPoints
    })
    const currentHoveredPointData = data.points[0]

    const currentHoveredCurveNumber = currentHoveredPointData.curveNumber

    // @ts-ignore
    Plotly.Fx.hover("plotMain", [...allHoverPoints, { curveNumber: currentHoveredCurveNumber, pointNumber: data.points[0].pointNumber }])
  }

  const selectPoints = (data: Readonly<PlotMouseEvent>) => {
    // @ts-ignore
    const traceName: string = data.points[0].fullData.name
    if (!elementSymbols.includes(traceName)) { return }
    const point = data.points[0].pointIndex
    const trace = data.points[0].curveNumber
    const unmodifiedElementData = elementData.filter(e => e.name !== traceName)
    const newElementData = elementData.filter(e => e.name === traceName)[0]
    const previouslySelectedPoints = newElementData.selectedpoints
    if (previouslySelectedPoints && previouslySelectedPoints.length) {
      if (!previouslySelectedPoints.includes(point)) {
        newElementData.selectedpoints = [...previouslySelectedPoints, point]
      } else {
        newElementData.selectedpoints = previouslySelectedPoints.filter(e => e != point)
      }
    } else {
      newElementData.selectedpoints = [point]
    }
    const updatedElementData = [...unmodifiedElementData, newElementData].sort(sortElementDataByAtomicNumber)
    updateElementData(updatedElementData)
  }

  console.log(plotData)

  return (
    <Plot
      ref={mainPlot}
      style={style}
      divId='plotMain'
      data={plotData}
      layout={layout}
      config={config}
      onHover={showLineHoverLabels}
      onClick={selectPoints}
    />
  )
}
