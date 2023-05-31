import {
  FileProps,
  Modification,
  ParsedData,
  Peak,
  PeakData
} from "../common/interfaces"
import { Dialog } from "@headlessui/react"
import { createId } from "@paralleldrive/cuid2"
import { PlotData, ScatterData } from "plotly.js-basic-dist-min"
import { useEffect, useRef } from "react"
import Draggable from "react-draggable"
import { peakDetect, removeBaseline, smooth } from "@/utils/processing"
import { IconActivity, IconTriangleSquareCircle } from "@tabler/icons-react"

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
  updateModificationModalVisibility: React.Dispatch<
    React.SetStateAction<boolean>
  >
  modificationModalVisibility: boolean
  updatePeakData: React.Dispatch<React.SetStateAction<PeakData>>
  peakData: PeakData
}

export default function ModificationModal({
  modificationModalVisibility,
  currentXRFData,
  updateFileData,
  updateXRFData,
  fileData,
  selectedFiles,
  currentModifiedData,
  updateModifiedData,
  updateModificationModalVisibility,
  updatePeakData,
  peakData
}: Props) {
  const scalingSliderRef = useRef<HTMLSpanElement>(null)
  const smoothingSliderRef = useRef<HTMLSpanElement>(null)
  const nodeRef = useRef(null)
  const formRef = useRef<HTMLFormElement>(null)

  const selectedXRFPlotData = currentXRFData.flatMap((e, i) =>
    selectedFiles.includes(i) ? e : []
  )

  const dataToModify = selectedXRFPlotData.map((data) => {
    const x = [...(data.x as number[])]
    const y = [...(data.y as number[])]

    return { x, y }
  })

  function modifyXRFData(scaleFactor: number, smoothingFactor: number) {
    const newXRFData = dataToModify.map((data, i) => {
      let y = data.y

      if (smoothingFactor) {
        smooth(y, smoothingFactor)
        y = y.map((e) => e * scaleFactor)
      } else {
        y = y.map((e) => e * scaleFactor)
      }

      const name = `${selectedXRFPlotData[i].name} [modified]`

      return {
        ...data,
        y: y,
        name: name,
        mode: "lines",
        type: "scattergl",
        textposition: "top center"
      }
    })

    //@ts-expect-error
    updateModifiedData(newXRFData)
  }

  function cancelModifications() {
    updateModificationModalVisibility(false)
    updateModifiedData([])
  }

  function applyModifications(modifications: Modification[]) {
    const newXRFData = currentModifiedData.map((data, i) => {
      const isScaled = modifications[i].scaleFactor !== 1
      const isSmoothed = modifications[i].smoothingRadius !== 0

      const name = `${data.name?.replace(" [modified]", "")} [${
        isScaled ? "scaled " + modifications[i].scaleFactor?.toFixed(2) : ""
      }${isScaled && isSmoothed ? ", " : ""}${isSmoothed ? "smoothed" : ""}]`

      return {
        ...data,
        name: name
      }
    })

    console.log(newXRFData)

    const newFileData = selectedFiles.map((e, i) => {
      const isScaled = modifications[i].scaleFactor !== 1
      const isSmoothed = modifications[i].smoothingRadius !== 0

      const name = `${fileData[e].name.replace(" [modified]", "")} [${
        isScaled ? "scaled " + modifications[i].scaleFactor?.toFixed(2) : ""
      }${isScaled && isSmoothed ? ", " : ""}${isSmoothed ? "smoothed" : ""}]`

      return {
        ...fileData[e],
        name: name,
        id: createId(),
        type: "mod",
        size: undefined,
        isModified: true,
        isSelected: false,
        modifications: modifications[i]
      }
    })

    updateXRFData([...currentXRFData, ...newXRFData])
    updateFileData([...fileData, ...newFileData])
    updatePeakData({
      set: [...peakData.set, ...peakData.modified],
      modified: []
    })
    updateModifiedData([])
    updateModificationModalVisibility(false)
  }

  function constructModifications(): Modification[] {
    if (!isNaN(Number(scalingSliderRef.current?.innerHTML ?? NaN))) {
      return selectedFiles.map(() => {
        return {
          scaleFactor: Number(scalingSliderRef.current?.innerHTML ?? 1),
          smoothingRadius: Number(smoothingSliderRef.current?.innerHTML ?? 0)
        }
      })
    } else return []
  }

  function modifyBaseline() {
    let data: Partial<PlotData>[]
    if (currentModifiedData.length) {
      data = [...currentModifiedData]
    } else {
      data = currentXRFData.flatMap((e, i) =>
        selectedFiles.includes(i) ? e : []
      )
    }

    const newData = data.map((e) => {
      return removeBaseline({ x: e.x as number[], y: e.y as number[] })
    })
    updateModifiedData(
      data.map((e, i) => {
        return {
          ...e,
          x: newData[i].x,
          y: newData[i].y
        }
      })
    )
  }

  function findPeaks() {
    const data = [...currentModifiedData]

    const peaks = data.map((e, i) => {
      const x = e.x as number[]
      const y = e.y as number[]

      return peakDetect({ x, y })
    })

    updatePeakData({ ...peakData, modified: peaks })
  }

  function closeModal() {
    updateModifiedData([])
    updatePeakData({ ...peakData, modified: [] })
    updateModificationModalVisibility(false)
  }

  return (
    <Dialog
      open={modificationModalVisibility}
      onClose={() => {
        closeModal()
      }}
      className="absolute left-0 top-0 z-50"
      as="div"
    >
      <Dialog.Overlay>
        <Draggable nodeRef={nodeRef} bounds={"html"} handle=".handle">
          <div
            className={`${
              modificationModalVisibility ? "block" : "hidden"
            } m-4 h-full w-full border  border-ptx bg-pbg`}
            ref={nodeRef}
          >
            <div className="handle h-8 w-full cursor-move border-b border-ptx"></div>
            <div className="flex flex-col p-4">
              <Dialog.Title as={"div"} className={"text-center font-medium"}>
                Modify selected data
              </Dialog.Title>
              <form
                onReset={() => {
                  modifyXRFData(1, 0)
                  scalingSliderRef.current!.innerText = "1.00"
                  smoothingSliderRef.current!.innerText = "0"
                }}
                id={"mainForm"}
                className="flex flex-col"
                ref={formRef}
              >
                <div id="scaling" className="flex space-x-2">
                  <span>Scale Factor</span>
                  <input
                    type="range"
                    id="scaleFactorSlider"
                    min={0.02}
                    max={5.0}
                    step={0.01}
                    defaultValue={1.0}
                    onChange={(e) => {
                      ;(e.target.nextSibling as HTMLSpanElement).innerText =
                        e.target.value
                      modifyXRFData(
                        Number(e.target.value),
                        Number(smoothingSliderRef.current?.innerText)
                      )
                    }}
                  ></input>
                  <span ref={scalingSliderRef} id="scaleFactorSliderValue">
                    1.00
                  </span>
                </div>
                <div id="smoothing" className="flex space-x-2">
                  <span>Smoothing radius</span>
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
                      modifyXRFData(
                        Number(scalingSliderRef.current?.innerText ?? 0),
                        Number(e.target.value)
                      )
                    }}
                  ></input>
                  <span
                    ref={smoothingSliderRef}
                    id="smoothingRadiusSliderValue"
                  >
                    0
                  </span>
                </div>
                <div className="mt-2 flex text-acc">
                  <div id="peaks" className="flex" title={"Find peaks"}>
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        findPeaks()
                      }}
                    >
                      <IconTriangleSquareCircle></IconTriangleSquareCircle>
                    </button>
                  </div>
                  <div
                    id="backgorund"
                    className="flex"
                    title={"Remove background"}
                  >
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        modifyBaseline()
                      }}
                    >
                      <IconActivity></IconActivity>
                    </button>
                  </div>
                </div>

                <menu className="flex justify-center">
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      formRef.current!.reset()
                      updateModifiedData([])
                    }}
                  >
                    Reset
                  </button>
                </menu>
              </form>
              <button
                onClick={() => applyModifications(constructModifications())}
              >
                Apply
              </button>
              <button onClick={() => cancelModifications()}>Cancel</button>
            </div>
          </div>
        </Draggable>
      </Dialog.Overlay>
    </Dialog>
  )
}
