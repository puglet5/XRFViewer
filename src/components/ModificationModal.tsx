import { peakDetect, removeBaseline, smooth } from "@/utils/processing"
import { createId } from "@paralleldrive/cuid2"
import { IconSquareMinus, IconSquarePlus } from "@tabler/icons-react"
import { memo, useEffect, useMemo, useRef, useState } from "react"
import { Modification, XRFData } from "../common/interfaces"

interface Props {
  data: XRFData[]
  setData: React.Dispatch<React.SetStateAction<XRFData[]>>
}

function ModificationModal({ data, setData }: Props) {
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
    modifyXRFData(modifications)
  }, [modifications, selectedXRFPlotData.length])

  useEffect(() => {
    if (!anySelected) {
      setData([...unmodifiedData])
    }
  }, [anySelected])

  function modifyXRFData(modifications: Modification) {
    const newData: XRFData[] = selectedXRFPlotData.map((e, i) => {
      let { x, y } = e.data

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

      let peaks
      const meta: { annotations: any[] } = { annotations: [] }

      if (modifications.peakDetection) {
        peaks = peakDetect(y, x)
        meta.annotations = peaks.map((e) => {
          return {
            ax: 0,
            x: e.position,
            y: e.intensity,
            showarrow: true,
            arrowhead: 3,
            arrowside: "end",
            arrowsize: 0.5,
            visible: true,
            clicktoshow: "onoff",
            align: "center",
            opacity: 1,
            bgcolor: "rgba(255,255,255,1)",
            bordercolor: "rgba(0,0,0,1)",
            arrowwidth: 0.5,
            text: e.position.toFixed(2).toString()
          }
        })
      }

      return {
        ...e,
        id: "0",
        data: { x, y },
        plotData: {
          x,
          y,
          name,
          mode: "lines",
          type: "scattergl",
          line: { simplify: true },
          meta
        },
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
