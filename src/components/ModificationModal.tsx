import { FileProps, Modification } from "@/utils/interfaces"
import { Dialog } from "@headlessui/react"
import { createId } from "@paralleldrive/cuid2"
import { ScatterData } from "plotly.js-basic-dist-min"
import { useRef } from "react"
import Draggable from "react-draggable"
import { smooth } from "@/utils/processing"

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
  updateModificationModalVisibility
}: Props) {
  const scalingSliderRef = useRef<HTMLSpanElement>(null)
  const smoothingSliderRef = useRef<HTMLSpanElement>(null)
  const nodeRef = useRef(null)

  const modifyXRFData = (scaleFactor: number, smoothingFactor: number) => {
    if (scaleFactor < 0 || smoothingFactor < 0) return

    const dataToModify = currentXRFData.flatMap((e, i) =>
      selectedFiles.includes(i) ? e : []
    )

    const newXRFData = dataToModify.map((data) => {
      let y = [...(data.y as number[])]
      return {
        ...data,
        y: smooth(y, smoothingFactor).map((e) => e * scaleFactor),
        name: `${data.name} [modified]`
      }
    })

    updateModifiedData([...newXRFData])
  }

  const cancelModifications = () => {
    updateModificationModalVisibility(false)
    updateModifiedData([])
  }

  const applyModifications = (modifications: Modification[]) => {
    const newXRFData = currentModifiedData.map((data, i) => {
      return {
        ...data,
        name: `${data.name} [scaled ${modifications[i].scaleFactor?.toFixed(
          2
        )}${modifications[i].smoothingRadius ? ", smoothed" : ""}]`
      }
    })

    const newFileData = selectedFiles.map((e, i) => {
      console.log(e)
      return {
        ...fileData[e],
        name: `${fileData[e].name} [scaled ${modifications[
          i
        ].scaleFactor?.toFixed(2)}]`,
        id: createId(),
        type: "mod",
        size: undefined,
        isModified: true,
        isSelected: false,
        modifications: {
          scaleFactor: modifications[i].scaleFactor,
          smoothingRadius: modifications[i].smoothingRadius
        }
      }
    })

    updateXRFData([...currentXRFData, ...newXRFData])
    updateFileData([...fileData, ...newFileData])
    updateModifiedData([])
    updateModificationModalVisibility(false)
  }

  const constructModifications = (): Modification[] => {
    if (!isNaN(Number(scalingSliderRef.current?.innerHTML ?? NaN))) {
      return selectedFiles.map(() => {
        return {
          scaleFactor: Number(scalingSliderRef.current?.innerHTML ?? 1),
          smoothingRadius: Number(scalingSliderRef.current?.innerHTML ?? 0)
        }
      })
    } else return []
  }

  return (
    <Dialog
      open={modificationModalVisibility}
      onClose={() => updateModificationModalVisibility(false)}
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
              <Dialog.Title>Modify selected data</Dialog.Title>
              <form
                method="dialog"
                onReset={() => {
                  modifyXRFData(1, 0)
                  scalingSliderRef.current!.innerText = "1.00"
                  smoothingSliderRef.current!.innerText = "0"
                }}
                className="flex flex-col"
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
                        Number(smoothingSliderRef.current?.innerText ?? 0)
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
                <menu className="flex justify-center">
                  <button type="reset" value="resetBtn">
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
