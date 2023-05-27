import { IconReload } from "@tabler/icons-react"
import { FileProps } from "../utils/interfaces"
import { ScatterData } from "plotly.js"
import { emissionLinePlotData } from "@/data/emissionLinePlotData"

interface Props {
  updateXRFData: React.Dispatch<React.SetStateAction<Partial<ScatterData>[]>>
  currentXRFData: Partial<ScatterData>[]
  updateFileData: React.Dispatch<React.SetStateAction<FileProps[]>>
  fileData: FileProps[]
  updateSelectedElements: React.Dispatch<React.SetStateAction<number[]>>
  selectedElements: number[]
  periodicTableVisibility: boolean
  updatePlotData: React.Dispatch<React.SetStateAction<Partial<ScatterData>[]>>
  updatePeriodicTableVisibility: React.Dispatch<React.SetStateAction<boolean>>
  selectedElementPoints: (number | undefined)[][]
  updateSelectedElementPoints: React.Dispatch<
    React.SetStateAction<(number | undefined)[][]>
  >
  updateModifiedData: React.Dispatch<
    React.SetStateAction<Partial<ScatterData>[]>
  >
  currentModifiedData: Partial<ScatterData>[]
}

export default function Controls({
  updateXRFData,
  currentXRFData,
  updateFileData,
  fileData,
  updateSelectedElements,
  selectedElements,
  updatePlotData,
  updatePeriodicTableVisibility,
  periodicTableVisibility,
  updateSelectedElementPoints,
  selectedElementPoints,
  updateModifiedData,
  currentModifiedData
}: Props) {
  const resetPlotData = () => {
    localStorage.clear()
    updatePlotData([])
    updateSelectedElements([])
    updateXRFData([])
    updateFileData([])
    updateModifiedData([])
    updateSelectedElementPoints(
      Array.from({ length: emissionLinePlotData.length }, () => [])
    )
  }
  return (
    <div className="flex w-full space-x-2">
      <button
        onClick={resetPlotData}
        title="Reset all"
        disabled={
          !currentXRFData.length && !fileData.length && !selectedElements.length
        }
        className="mx-auto text-acc disabled:text-sfg"
      >
        <IconReload className="h-8 w-8" />
      </button>
    </div>
  )
}
