import { FileProps } from "@/utils/interfaces"
import { Dialog } from "@headlessui/react"
import { createId } from "@paralleldrive/cuid2"
import { ScatterData } from "plotly.js-basic-dist-min"
import { useRef } from "react"
import Draggable from 'react-draggable'

interface Props {
  updateXRFData: React.Dispatch<React.SetStateAction<Partial<ScatterData>[]>>
  currentXRFData: Partial<ScatterData>[]
  updateModifiedData: React.Dispatch<React.SetStateAction<Partial<ScatterData>[]>>
  currentModifiedData: Partial<ScatterData>[]
  updateFileData: React.Dispatch<React.SetStateAction<FileProps[]>>
  fileData: FileProps[]
  selectedFiles: number[]
  updateModificationModalVisibility: React.Dispatch<React.SetStateAction<boolean>>
  modificationModalVisibility: boolean
}

interface Modification {
  scaleFactor?: number
}

export default function ModificationModal({ modificationModalVisibility, currentXRFData, updateFileData, updateXRFData, fileData, selectedFiles, currentModifiedData, updateModifiedData, updateModificationModalVisibility }: Props) {

  const sliderValueRef = useRef<HTMLSpanElement>(null)
  const nodeRef = useRef(null)

  const scaleXRFData = (scaleFactor: number) => {
    if (scaleFactor < 0) return

    const dataToModify = currentXRFData.flatMap((e, i) => selectedFiles.includes(i) ? e : [])

    const newXRFData = dataToModify.map(data => {
      return {
        ...data,
        y: (data.y as number[]).map(e => e * scaleFactor),
        name: `${data.name} [scaled]`
      }
    })

    updateModifiedData([...newXRFData])
  }

  const showSliderValue = (value: string) => {
    sliderValueRef.current!.innerHTML = Number(value).toFixed(2)
  }

  const cancelModifications = () => {
    updateModificationModalVisibility(false)
    updateModifiedData([])
  }

  const applyModifications = (modifications: Modification[]) => {

    console.log(modifications)


    const dataToModify = currentXRFData.flatMap((e, i) => selectedFiles.includes(i) ? e : [])

    const newXRFData = dataToModify.map((data, i) => {
      return {
        ...data,
        y: (data.y as number[]).map(e => e * (modifications[i].scaleFactor ?? 1)),
        name: `${data.name} [scaled ${modifications[i].scaleFactor?.toFixed(2)}]`
      }
    })

    const newFileData = selectedFiles.map((e, i) => {
      console.log(e)
      return {
        ...fileData[e],
        name: `${fileData[e].name} [scaled ${modifications[i].scaleFactor?.toFixed(2)}]`,
        id: createId(),
        type: "mod",
        size: undefined,
        isModified: true,
        isSelected: false,
        modifications: {
          scaleFactor: modifications[i].scaleFactor
        }
      }
    })

    updateXRFData([...currentXRFData, ...newXRFData])
    updateFileData([...fileData, ...newFileData])
    updateModifiedData([])
    updateModificationModalVisibility(false)
  }

  const constructModifications = (): Modification[] => {
    if (!isNaN(Number(sliderValueRef.current?.innerHTML ?? NaN))) {
      return selectedFiles.map(() => {
        return { scaleFactor: Number(sliderValueRef.current?.innerHTML ?? 1) }
      })
    } else return []
  }

  return (
    <Dialog
      open={modificationModalVisibility}
      onClose={() => updateModificationModalVisibility(false)}
      className="absolute top-0 left-0 z-50"
      as="div">
      <Dialog.Overlay>
        <Draggable
          nodeRef={nodeRef}
          bounds={"html"}
          handle=".handle"
        >
          <div className={`${modificationModalVisibility ? "block" : "hidden"} bg-pbg border border-ptx m-4  w-full h-full`} ref={nodeRef} >
            <div className="w-full h-8 border-b border-ptx handle cursor-move"></div>
            <div className="flex flex-col p-4">
              <Dialog.Title>Modify selected data</Dialog.Title>
              <form method="dialog"
                onReset={() => {
                  scaleXRFData(1)
                  showSliderValue("1.00")
                }}>
                <div id="scaling" className="flex space-x-2">
                  <span>Scale Factor</span>
                  <input
                    type="range"
                    id="scaleFactorSlider"
                    min={0.02}
                    max={5.00}
                    step={0.01}
                    defaultValue={1.00}
                    onChange={(e) => {
                      scaleXRFData(Number(e.target.value))
                      showSliderValue(e.target.value)
                    }}
                  >
                  </input>
                  <span ref={sliderValueRef} id="scaleFactorSliderValue">1.00</span>
                </div>
                <menu className="flex justify-center">
                  <button type="reset" value="resetBtn">Reset</button>
                </menu>
              </form>
              <button onClick={() => applyModifications(constructModifications())}>Apply</button>
              <button onClick={() => cancelModifications()}>Cancel</button>
            </div>
          </div>
        </Draggable>
      </Dialog.Overlay>
    </Dialog >
  )
}

