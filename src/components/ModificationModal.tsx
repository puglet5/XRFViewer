import { FileProps, Modification, PeakData } from "../common/interfaces"
import { createId } from "@paralleldrive/cuid2"
import { ScatterData } from "plotly.js-basic-dist-min"
import { useEffect, useRef, useState } from "react"
import { peakDetect, removeBaseline, smooth } from "@/utils/processing"
import { IconSquarePlus, IconSquareX } from "@tabler/icons-react"
import { useForm } from "react-hook-form"

interface Props {
  updateXRFData: React.Dispatch<React.SetStateAction<Partial<ScatterData>[]>>
  currentXRFData: Partial<ScatterData>[]
  updateModifiedData: React.Dispatch<
    React.SetStateAction<Partial<ScatterData>[]>
  >
  currentModifiedData: Partial<ScatterData>[]
  updateFileData: React.Dispatch<React.SetStateAction<FileProps[]>>
  fileData: FileProps[]
  selectedFiles: number[]
  updatePeakData: React.Dispatch<React.SetStateAction<PeakData>>
  peakData: PeakData
  updatePlotRevision: React.Dispatch<React.SetStateAction<number>>
  plotRevision: number
}

export default function ModificationModal({
  currentXRFData,
  updateFileData,
  updateXRFData,
  fileData,
  selectedFiles,
  currentModifiedData,
  updateModifiedData,
  updatePeakData,
  peakData,
  updatePlotRevision,
  plotRevision
}: Props) {
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

  useEffect(() => {
    modifyXRFData(modifications)
  }, [modifications])

  const selectedXRFPlotData = currentXRFData.flatMap((e, i) =>
    selectedFiles.includes(i) ? e : []
  )

  const dataToModify = selectedXRFPlotData.map((data) => {
    const x = [...(data.x as number[])]
    const y = [...(data.y as number[])]

    return { x, y }
  })

  function modifyXRFData(modifications: Modification) {
    const newXRFData = dataToModify.map((data, i) => {
      let { x, y } = data

      if (modifications.smoothingRadius) {
        smooth(y, modifications.smoothingRadius)
        y = y.map((e) => e * modifications.scalingFactor!)
      } else {
        y = y.map((e) => e * modifications.scalingFactor!)
      }

      if (modifications.baselineCorrection) y = removeBaseline({ x, y })

      const name = `${selectedXRFPlotData[i].name} [modified]`

      if (modifications.peakDetection) {
        let peaks = peakDetect(y, x)
        updatePeakData({ ...peakData, modified: [peaks] })
      }

      return {
        x,
        y,
        name,
        mode: "lines",
        type: "scattergl",
        line: { simplify: true }
      }
    })

    //@ts-expect-error
    updateModifiedData(newXRFData)
  }

  function applyModifications(modifications: Modification) {
    const newXRFData = currentModifiedData.map((data, i) => {
      const isScaled = modifications.scalingFactor !== 1
      const isSmoothed = modifications.smoothingRadius !== 0

      const name = `${data.name?.replace(" [modified]", "")} [${
        isScaled ? "scaled " + modifications.scalingFactor?.toFixed(2) : ""
      }${isScaled && isSmoothed ? ", " : ""}${isSmoothed ? "smoothed" : ""}]`

      return {
        ...data,
        name: name
      }
    })

    const newFileData = selectedFiles.map((e, i) => {
      const isScaled = modifications.scalingFactor !== 1
      const isSmoothed = modifications.smoothingRadius !== 0

      const name = `${fileData[e].name.replace(" [modified]", "")} [${
        isScaled ? "scaled " + modifications.scalingFactor?.toFixed(2) : ""
      }${isScaled && isSmoothed ? ", " : ""}${isSmoothed ? "smoothed" : ""}]`

      return {
        ...fileData[e],
        name: name,
        id: createId(),
        type: "mod",
        size: undefined,
        isModified: true,
        isSelected: false,
        modifications: modifications
      }
    })

    updateXRFData([...currentXRFData, ...newXRFData])
    updateFileData([...fileData, ...newFileData])
    updatePeakData({
      set: [...peakData.set, ...peakData.modified],
      modified: []
    })
    updateModifiedData([])
  }

  let isVisible = !!selectedFiles.length

  return (
    <div className={"m-2 block" + (isVisible ? "" : " hidden")}>
      <div className="flex flex-col">
        <form
          onReset={() => {
            setModifications({
              scalingFactor: 1,
              smoothingRadius: 0,
              baselineCorrection: false,
              peakDetection: false
            })
            scalingSliderRef.current!.innerText = "1.00"
            smoothingSliderRef.current!.innerText = "0"
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
                ;(e.target.nextSibling as HTMLSpanElement).innerText = Number(
                  e.target.value
                ).toFixed(2)
                setModifications({
                  ...modifications,
                  scalingFactor: Number(e.target.value)
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
                  smoothingRadius: Number(e.target.value)
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
                updateModifiedData([])
                updatePeakData({ ...peakData, modified: [] })
              }}
            >
              <IconSquareX />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault()
                applyModifications(modifications)
                updateModifiedData([])
                updatePeakData({ ...peakData, modified: [] })
              }}
              title={"Apply"}
            >
              <IconSquarePlus />
            </button>
          </menu>
        </form>
      </div>
    </div>
  )
}
