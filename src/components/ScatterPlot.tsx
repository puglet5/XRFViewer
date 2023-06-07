import { Config, Layout, ScatterData } from "plotly.js"
//@ts-ignore
import Plotly from "plotly.js-strict-dist"
import { memo, useEffect, useRef, useState } from "react"
import html2canvas from "html2canvas"
import { IconDeviceFloppy, IconCopy } from "@tabler/icons-react"

import createPlotlyComponent from "react-plotly.js/factory"
import { PeakData } from "@/common/interfaces"
import { debounce } from "lodash"

interface Props {
  plotData: Partial<ScatterData>[]
  elementData: Partial<ScatterData>[]
  updateElementData: React.Dispatch<
    React.SetStateAction<Partial<ScatterData>[]>
  >
  peakData: PeakData
  currentModifiedData: Partial<ScatterData>[]
  currentXRFData: Partial<ScatterData>[]
  plotRevision: number
}

const Plot = createPlotlyComponent(Plotly)

const config: Partial<Config> = {
  showTips: false,
  scrollZoom: true,
  displaylogo: false,
  editable: true,
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

function ScatterPlot({ plotData }: Props) {
  const dragLayerRef = useRef<HTMLElement | null>(null)
  const [mousePosition, setMousePotistion] = useState([0, 0])
  const [layout, setLayout] = useState<Partial<Layout>>({
    margin: {
      l: 100,
      r: 20,
      b: 60,
      t: 30,
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
      showspikes: true,
      spikemode: "across+marker",
      spikesnap: "cursor",
      spikecolor: "black",
      spikethickness: 0.3,
      spikedash: "solid",
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
    },
    hovermode: "closest",
    hoverdistance: -1
  })

  useEffect(() => {
    //@ts-expect-error
    const annotations = plotData.flatMap((e) => e.meta?.annotations ?? [])
    if (annotations.length) {
      layout.annotations = annotations
    } else {
      layout.annotations = []
    }
  }, [plotData])

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

  function attachPlotMouseListener() {
    // https://github.com/plotly/plotly.js/issues/1548
    let gd = document.getElementById("plotMain") as any
    let margin = gd._fullLayout.margin
    let offsets = gd.getBoundingClientRect()

    //Calculate linear function to convert x coord
    let xy1 = gd.layout.xaxis.range[0]
    let xy2 = gd.layout.xaxis.range[1]
    let xx1 = offsets.left + margin.l
    let xx2 = offsets.left + gd.offsetWidth - margin.r
    let mx = (xy2 - xy1) / (xx2 - xx1)
    let cx = -(mx * xx1) + xy1

    //Calculate linear function to convert y coord
    let yy1 = gd.layout.yaxis.range[0]
    let yy2 = gd.layout.yaxis.range[1]
    let yx1 = offsets.top + gd.offsetHeight - margin.b
    let yx2 = offsets.top + margin.t
    let my = (yy2 - yy1) / (yx2 - yx1)
    let cy = -(my * yx1) + yy1

    let listener = function (e: MouseEvent) {
      let xInDataCoord = mx * e.x + cx
      let yInDataCoord = my * e.y + cy
      setMousePotistion([xInDataCoord, yInDataCoord])
    }

    gd.removeEventListener("mousemove", listener)
    gd.addEventListener("mousemove", listener)
  }

  return (
    <>
      <div
        id="plotControls"
        className="sticky z-20 flex w-full space-x-1 border-b border-ptx p-3 text-acc"
      >
        <button
          onClick={savePlotImage}
          title="Save plot as .png"
          className={plotData.flat().length ? "" : "!text-gray-300"}
          disabled={plotData.flat().length ? false : true}
        >
          <IconDeviceFloppy></IconDeviceFloppy>
        </button>
        <button
          onClick={() => {
            setLayout({ ...layout, showlegend: !layout.showlegend })
          }}
        >
          Legend
        </button>
        <button
          onClick={copyPlotImage}
          title="Copy plot image to clipboard"
          className={plotData.flat().length ? "" : "!text-gray-300"}
          disabled={plotData.flat().length ? false : true}
        >
          <IconCopy></IconCopy>
        </button>
      </div>
      <Plot
        divId="plotMain"
        data={plotData}
        layout={layout}
        config={config}
        className="h-[calc(100vh-6.6rem)] w-full"
        style={{ clipPath: "none" }}
        onInitialized={() => {
          dragLayerRef.current = document.querySelector(
            ".draglayer"
          ) as HTMLElement
          dragLayerRef.current.classList.add("!cursor-pointer")
        }}
        onUpdate={() => {
          attachPlotMouseListener()
        }}
      />
      <div
        className={"h-full w-full border-t border-ptx"}
      >{`Energy: ${mousePosition[0].toFixed(
        2
      )}, Intensity ${mousePosition[1].toFixed(2)}`}</div>
    </>
  )
}

export default memo(ScatterPlot)
