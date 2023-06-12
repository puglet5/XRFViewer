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

type Props = {
  data: XRFData[]
  setData: React.Dispatch<React.SetStateAction<XRFData[]>>
  selectedRange: SelectionRange | null
}

function ModificationModal({ data, setData, selectedRange }: Props) {
  const [modifications, setModifications] = useState<Modification>({
    scalingFactor: 1,
    smoothingRadius: 0,
    baselineCorrection: false,
    peakDetection: false
  })

  const scalingSliderRef = useRef<HTMLSpanElement>(null)
  const smoothingSliderRef = useRef<HTMLSpanElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const baselineCheckboxRef = useRef<HTMLInputElement>(null)
  const peakCheckboxRef = useRef<HTMLInputElement>(null)

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

  useEffect(() => {
    if (deconvolvedDataLength) {
      let { x, y } = modifiedData[0].data.deconvolved!.at(-1)!
      let deconvolvedPlotData: Partial<ScatterData> = {
        x,
        y,
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
      modifiedData[0].plotData = [
        ...modifiedData[0].plotData,
        deconvolvedPlotData
      ]
    }
  }, [deconvolvedDataLength])

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
      let { x, y } = e.data.original

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
        text = x.map((pos, i) =>
          peaks.find((e) => e.position === pos)
            ? pos.toFixed(2).toString()
            : "    "
        )
      }

      return {
        ...e,
        id: "0",
        data: { original: { x, y } },
        plotData: [
          {
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
            textposition: "top center"
          }
        ],
        isModified: true,
        isBeingModified: true,
        isSelected: false,
        modifications: modifications,
        file: { ...e.file, type: ".mod", size: undefined }
      }
    })

    //@ts-ignore
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
    peakCheckboxRef.current!.checked = false
    baselineCheckboxRef.current!.checked = false
    setModifications(modifications)
    modifyXRFData(modifications)
  }

  async function sendDeconvolveRequest() {
    if (selectedRange) {
      try {
        let res = await axios({
          method: "POST",
          data: {
            data: modifiedData.at(-1)!.data.original,
            range: selectedRange.x
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

  function mergeFittedData(data: any) {
    if (modifiedData.length !== 1) return

    let currentDeconvolvedData = modifiedData[0].data.deconvolved
    if (currentDeconvolvedData) {
      modifiedData[0].data.deconvolved = [
        ...currentDeconvolvedData,
        data.fittedData.bestFit
      ]
    } else {
      modifiedData[0].data.deconvolved = [data.fittedData.bestFit]
    }
    setData([...unmodifiedData, ...modifiedData])
  }

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
              ref={peakCheckboxRef}
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
              ref={baselineCheckboxRef}
              onChange={(e) => {
                setModifications({
                  ...modifications,
                  baselineCorrection: e.target.checked
                })
              }}
            />
          </div>
          <div id="baseline" className="flex space-x-2">
            <button
              title={"Deconvolve selected range"}
              onClick={async (e) => {
                e.preventDefault()
                let fitted = await sendDeconvolveRequest()
                mergeFittedData(fitted)
              }}
              disabled={modifiedData.length !== 1 || !selectedRange}
              className={"disabled:text-gray-400"}
            >
              <IconChartHistogram></IconChartHistogram>
            </button>
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
    </div>
  )
}

export default memo(ModificationModal)
