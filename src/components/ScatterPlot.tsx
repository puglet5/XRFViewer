import {
  IconAlignBoxRightMiddle,
  IconArrowAutofitContent,
  IconAxisY,
  IconCopy,
  IconDeviceFloppy,
  IconTooltip
} from "@tabler/icons-react"
import html2canvas from "html2canvas"
import { AxisType, Config, Layout, ScatterData } from "plotly.js"
//@ts-ignore
import Plotly from "plotly.js-strict-dist"
import { memo, useEffect, useRef, useState } from "react"

import createPlotlyComponent from "react-plotly.js/factory"

interface Props {
  plotData: Partial<ScatterData>[]
}
const Plot = createPlotlyComponent(Plotly)

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
      hoverformat: ".2f",
      autorange: true
    },
    yaxis: {
      showgrid: true,
      zeroline: true,
      showline: true,
      autorange: true,
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
    hovermode: "x",
    hoverdistance: -1
  })
  const [config, setConfig] = useState<Partial<Config>>({
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
  })

  useEffect(() => {
    //@ts-expect-error
    const annotations = plotData.flatMap((e) => e.meta?.annotations ?? [])
    if (annotations.length) {
      setLayout({ ...layout, annotations })
    } else {
      setLayout({ ...layout, annotations: [] })
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
    const gd = document.getElementById("plotMain") as any
    const margin = gd._fullLayout.margin
    const offsets = gd.getBoundingClientRect()

    //Calculate linear function to convert x coord
    const xy1 = gd.layout.xaxis.range[0]
    const xy2 = gd.layout.xaxis.range[1]
    const xx1 = offsets.left + margin.l
    const xx2 = offsets.left + gd.offsetWidth - margin.r
    const mx = (xy2 - xy1) / (xx2 - xx1)
    const cx = -(mx * xx1) + xy1

    //Calculate linear function to convert y coord
    const yy1 = gd.layout.yaxis.range[0]
    const yy2 = gd.layout.yaxis.range[1]
    const yx1 = offsets.top + gd.offsetHeight - margin.b
    const yx2 = offsets.top + margin.t
    const my = (yy2 - yy1) / (yx2 - yx1)
    const cy = -(my * yx1) + yy1

    const listener = function (e: MouseEvent) {
      const xInDataCoord = mx * e.x + cx
      const yInDataCoord = my * e.y + cy
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
          onClick={() => {
            setLayout({ ...layout, showlegend: !layout.showlegend })
          }}
          title={"Toggle legend"}
        >
          <IconAlignBoxRightMiddle />
        </button>
        <button
          onClick={() => {
            setLayout({ ...layout, hoverdistance: -1 - layout.hoverdistance! })
          }}
          title={"Toggle hover labels"}
        >
          <IconTooltip />
        </button>
        <button
          onClick={() => {
            const axisType = layout.yaxis!.type === "log" ? "linesar" : "log"
            setLayout({
              ...layout,
              yaxis: {
                ...layout.yaxis,
                type: axisType as AxisType
              }
            })
          }}
          title={"Toggle log scale"}
        >
          <IconAxisY />
        </button>
        <button
          onClick={() => {
            const dragMode = layout.dragmode === "pan" ? "select" : "pan"
            setLayout({
              ...layout,
              dragmode: dragMode
            })
          }}
          title={"Toggle selection"}
        >
          <IconArrowAutofitContent />
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
