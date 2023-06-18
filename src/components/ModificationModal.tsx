import { peakDetect, removeBaseline, smooth } from "@/utils/processing"
import { createId } from "@paralleldrive/cuid2"
import {
  IconChartHistogram,
  IconSquareMinus,
  IconSquarePlus
} from "@tabler/icons-react"
import { memo, useEffect, useMemo, useRef, useState } from "react"
import { Modification, ParsedData, Peak, XRFData } from "../common/interfaces"
import axios from "axios"
import { sdpUrl, timeout } from "@/common/settings"
import { SelectionRange, ScatterData } from "plotly.js"
import Draggable from "react-draggable"
import { useHotkeys } from "react-hotkeys-hook"

type Props = {
  data: XRFData[]
  setData: React.Dispatch<React.SetStateAction<XRFData[]>>
  selectedRange: SelectionRange | null
}

interface DeconvolveAPIResponse {
  message?: string
  fitReport: string
  fittedData: {
    bestFit: ParsedData
    components: ParsedData[]
    peaks: ParsedData
  }
}

function ModificationModal({ data, setData, selectedRange }: Props) {
  const [modifications, setModifications] = useState<Modification>({
    scalingFactor: 1,
    smoothingRadius: 0,
    baselineCorrection: false,
    peakDetection: false
  })
  const [deconvolutionPlotMode, setDeconvolutionPlotMode] = useState<
    "comps" | "sum"
  >("sum")

  const [fitReportVisibility, setFitReportVisibility] = useState<boolean>(false)

  const scalingSliderRef = useRef<HTMLSpanElement>(null)
  const smoothingSliderRef = useRef<HTMLSpanElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const baselineToggleRef = useRef<HTMLInputElement>(null)
  const peakToggleRef = useRef<HTMLInputElement>(null)
  const nPeaksInputRef = useRef<HTMLInputElement>(null)
  const plotCompsToggleRef = useRef<HTMLInputElement>(null)
  const fitReportContentDivRef = useRef<HTMLDivElement>(
    document.getElementById("fitReportContentDiv") as HTMLDivElement
  )
  const nodeRef = useRef(null)

  const selectedXRFPlotData = useMemo(
    () => data.filter((e) => e.isSelected === true),
    [data]
  )

  const deconvolvedDataLength = useMemo(
    () =>
      data.flatMap((e) => (e.data.deconvolved ? e.data.deconvolved : []))
        .length,
    [data]
  )

  const modifiedData = useMemo(
    () => data.filter((e) => e.isBeingModified === true),
    [data]
  )

  const unmodifiedData = useMemo(
    () => data.filter((e) => e.isBeingModified === false),
    [data]
  )

  const anySelected = useMemo(
    () => data.map((e) => e.isSelected).some((e) => e === true),
    [data]
  )

  // Plot deconvolved data
  useEffect(() => {
    if (
      modifiedData &&
      modifiedData[0] &&
      modifiedData[0].data.deconvolved &&
      modifiedData[0].data.deconvolvedComponents
    ) {
      if (deconvolutionPlotMode === "sum") {
        const deconvolvedPlotData: Partial<ScatterData>[] =
          modifiedData[0].data.deconvolved.map((e) => {
            return {
              x: e.x,
              y: e.y,
              showlegend: false,
              type: "scattergl",
              name: "",
              fill: "tozeroy",
              hoverinfo: "none",
              fillcolor: "gray",
              line: {
                color: "black"
              },
              opacity: 0.3
            }
          })

        modifiedData[0].plotData.deconvolutions = deconvolvedPlotData
      } else if (deconvolutionPlotMode === "comps") {
        const deconvolvedPlotData: Partial<ScatterData>[] =
          modifiedData[0].data.deconvolvedComponents.map((e) => {
            return {
              x: e.x,
              y: e.y,
              showlegend: false,
              type: "scattergl",
              name: "",
              fill: "tozeroy",
              hoverinfo: "none",
              opacity: 0.3,
              line: {
                dash: "dash"
              }
            }
          })
        modifiedData[0].plotData.deconvolutions = deconvolvedPlotData
      }
    }
    setData([...unmodifiedData, ...modifiedData])
  }, [deconvolvedDataLength, deconvolutionPlotMode])

  useEffect(() => {
    modifyXRFData(modifications)
  }, [modifications, selectedXRFPlotData.length])

  useEffect(() => {
    if (!anySelected) {
      setData([...unmodifiedData])
    }
  }, [anySelected])

  function modifyXRFData(modifications: Modification) {
    const newData: XRFData[] = selectedXRFPlotData.map((e, i) => {
      const x = e.data.original.x
      let y = e.data.original.y

      if (modifications.smoothingRadius) {
        y = smooth(y, modifications.smoothingRadius)
        y = y.map((e) => e * modifications.scalingFactor!)
      } else {
        y = y.map((e) => e * modifications.scalingFactor!)
      }

      if (modifications.baselineCorrection) {
        y = removeBaseline({ x, y })
      }

      const name = `${selectedXRFPlotData[i].file.name} [modified]`

      let peaks: Peak[] = []
      let text = [" "]

      if (modifications.peakDetection) {
        peaks = peakDetect(y, x)
        text = x.map((pos) =>
          peaks.find((e) => e.position === pos)
            ? pos.toFixed(2).toString()
            : "    "
        )
      }

      return {
        ...e,
        id: "0",
        data: {
          original: e.data.original,
          modified: { x, y },
          selectedPoints: e.data.selectedPoints
        },
        plotData: {
          main: {
            x,
            y,
            name,
            mode: "text+lines",
            textinfo: "text",
            type: "scattergl",
            line: { simplify: true },
            text,
            hoverinfo: "x+y+name",
            unselected: {
              opacity: 1,
              color: "black",
              textfont: {
                color: "black"
              }
            },
            textfont: {
              color: "black",
              family: "FiraCode"
            },
            textposition: "top center",
            selectedpoints: []
          }
        },
        isModified: true,
        isBeingModified: true,
        isSelected: false,
        modifications: modifications,
        file: { ...e.file, type: ".mod", size: undefined }
      }
    })

    setData([...unmodifiedData, ...newData])
  }

  function applyModifications(modifications: Modification) {
    const newXRFData = modifiedData.map((e) => {
      const isScaled = modifications.scalingFactor !== 1
      const isSmoothed = modifications.smoothingRadius !== 0

      const name = `${e.file.name?.replace(" [modified]", "")} [${
        isScaled ? "scaled " + modifications.scalingFactor?.toFixed(2) : ""
      }${isScaled && isSmoothed ? ", " : ""}${isSmoothed ? "smoothed" : ""}]`

      return {
        ...e,
        id: createId(),
        name,
        isBeingModified: false,
        isModified: true
      }
    })

    setData([...data, ...newXRFData])
  }

  function resetModifications() {
    const modifications = {
      scalingFactor: 1,
      smoothingRadius: 0,
      baselineCorrection: false,
      peakDetection: false
    }
    scalingSliderRef.current!.innerText = "1.00"
    smoothingSliderRef.current!.innerText = "0"
    peakToggleRef.current!.checked = false
    baselineToggleRef.current!.checked = false
    setModifications(modifications)
    modifyXRFData(modifications)
  }

  async function sendDeconvolveRequest(
    range: number[],
    nPeaks: number,
    sigmaMax = 0.2,
    centerOffsetRange = 0.2,
    fitBackground = false,
    fitToPeaks = true
  ) {
    if (selectedRange) {
      try {
        const res = await axios({
          method: "POST",
          data: {
            data: modifiedData.at(-1)!.data.modified,
            range,
            n_peaks: nPeaks,
            sigma_max: sigmaMax,
            center_offset_range: centerOffsetRange,
            fit_background: fitBackground,
            fit_to_peaks: fitToPeaks
          },
          timeout,
          url: `${sdpUrl}/deconvolve`
        })
        return res.data
      } catch (error) {
        console.error(error)
      }
    }
  }

  function mergeFittedData(data: DeconvolveAPIResponse["fittedData"]) {
    if (modifiedData.length !== 1) return

    const currentDeconvolvedData = modifiedData[0].data.deconvolved
    const currentDeconvolvedComponentsData =
      modifiedData[0].data.deconvolvedComponents
    if (currentDeconvolvedData) {
      modifiedData[0].data.deconvolved = [
        ...currentDeconvolvedData,
        data.bestFit
      ]
    } else {
      modifiedData[0].data.deconvolved = [data.bestFit]
    }

    if (currentDeconvolvedComponentsData) {
      modifiedData[0].data.deconvolvedComponents = [
        ...currentDeconvolvedComponentsData,
        ...data.components
      ]
    } else {
      modifiedData[0].data.deconvolvedComponents = data.components
    }
    setData([...unmodifiedData, ...modifiedData])
  }

  function toggleDeconvolutionPlotMode() {
    if (deconvolutionPlotMode === "comps") {
      setDeconvolutionPlotMode("sum")
    } else {
      setDeconvolutionPlotMode("comps")
    }
  }

  useHotkeys(
    "esc",
    () => {
      setFitReportVisibility(false)
    },
    { enableOnContentEditable: true, enableOnFormTags: true }
  )

  useHotkeys(
    "ctrl+f",
    () => {
      setFitReportVisibility(!fitReportVisibility)
    },
    { enableOnContentEditable: true, enableOnFormTags: true }
  )

  return (
    <div
      className={
        "m-2 select-none" +
        (anySelected ? " hidden @2xs/sidebar:block" : " hidden")
      }
    >
      <div className="flex flex-col">
        <form
          onReset={() => {
            resetModifications()
          }}
          id={"mainForm"}
          className="flex flex-col items-center"
          ref={formRef}
        >
          <div id="scaling" className="flex space-x-2">
            <span>SF</span>
            <input
              type="range"
              id="scalingFactorSlider"
              min={0.02}
              max={5.0}
              step={0.01}
              defaultValue={1.0}
              onChange={(e) => {
                ;(e.target.nextSibling as HTMLSpanElement).innerText = (+e
                  .target.value).toFixed(2)
                setModifications({
                  ...modifications,
                  scalingFactor: +e.target.value
                })
              }}
            ></input>
            <span ref={scalingSliderRef} id="scalingFactorSliderValue">
              1.00
            </span>
          </div>
          <div id="smoothing" className="flex space-x-2">
            <span>SR</span>
            <input
              type="range"
              id="smoothingRadiusSlider"
              min={0}
              max={3}
              step={1}
              defaultValue={0}
              onChange={(e) => {
                ;(e.target.nextSibling as HTMLSpanElement).innerText =
                  e.target.value
                setModifications({
                  ...modifications,
                  smoothingRadius: +e.target.value
                })
              }}
            ></input>
            <span ref={smoothingSliderRef} id="smoothingRadiusSliderValue">
              0
            </span>
          </div>
          <div id="peaks" className="flex space-x-2">
            <span>Peaks</span>
            <input
              type="checkbox"
              defaultChecked={false}
              ref={peakToggleRef}
              onChange={(e) => {
                setModifications({
                  ...modifications,
                  peakDetection: e.target.checked
                })
              }}
            />
          </div>
          <div id="baseline" className="flex space-x-2">
            <span>Baseline</span>
            <input
              type="checkbox"
              defaultChecked={false}
              ref={baselineToggleRef}
              onChange={(e) => {
                setModifications({
                  ...modifications,
                  baselineCorrection: e.target.checked
                })
              }}
            />
          </div>
          <div id="deconvolve" className="flex space-x-2">
            <button
              title={"Deconvolve selected range"}
              onClick={async (e) => {
                e.preventDefault()
                const res = (await sendDeconvolveRequest(
                  selectedRange!.x,
                  +nPeaksInputRef.current!.value ?? 3
                )) as DeconvolveAPIResponse
                fitReportContentDivRef.current.innerText = res.fitReport
                mergeFittedData(res.fittedData)
              }}
              disabled={modifiedData.length !== 1 || !selectedRange}
              className={"disabled:text-gray-400"}
            >
              <IconChartHistogram></IconChartHistogram>
            </button>
            <input
              type="number"
              defaultValue={3}
              min={-1}
              max={20}
              step={1}
              ref={nPeaksInputRef}
              className={
                "block w-24 rounded border border-ptx bg-transparent px-3 py-0.5 outline-none"
              }
            />
            <input
              type="checkbox"
              defaultChecked={false}
              ref={plotCompsToggleRef}
              onChange={() => toggleDeconvolutionPlotMode()}
            />
          </div>

          <menu className="mt-2 flex justify-center text-acc ">
            <button
              onClick={(e) => {
                e.preventDefault()
                applyModifications(modifications)
              }}
              title={"applyModifications"}
            >
              <IconSquarePlus />
            </button>
            <button
              title={"Reset"}
              id={"resetModifications"}
              onClick={(e) => {
                e.preventDefault()
                formRef.current!.reset()
              }}
            >
              <IconSquareMinus></IconSquareMinus>
            </button>
          </menu>
        </form>
      </div>
      <div
        className={
          "z-40 m-4 text-sm " + (fitReportVisibility ? "absolute" : "hidden")
        }
        id={"fitReport"}
      >
        <Draggable handle=".handle" nodeRef={nodeRef}>
          <div ref={nodeRef} className={""}>
            <div className="handle h-4 w-full cursor-move border border-ptx bg-white"></div>
            <div
              id="fitReportContent"
              ref={fitReportContentDivRef}
              className={
                "h-64 overflow-y-scroll border border-t-0 border-ptx bg-white"
              }
            >
              Fit Report
            </div>
          </div>
        </Draggable>
      </div>
    </div>
  )
}

export default memo(ModificationModal)
