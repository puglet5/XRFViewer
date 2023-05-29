import { IconReload } from "@tabler/icons-react"
import { FileProps } from "../utils/interfaces"
import { ScatterData } from "plotly.js"
import { emissionLinePlotData } from "@/data/emissionLinePlotData"
import Uploader from "./Uploader"

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
    <div className="flex w-full items-center justify-center space-x-2">
      <button
        onClick={resetPlotData}
        title="Reset all"
        disabled={
          !currentXRFData.length && !fileData.length && !selectedElements.length
        }
        className="text-acc disabled:text-sfg"
      >
        <IconReload className="h-6 w-6" />
      </button>
      <div
        id="uploader"
        title={"Upload files"}
        className="hidden h-full items-center justify-center @2xs/sidebar:flex"
      >
        <Uploader
          updateXRFData={updateXRFData}
          updateFileData={updateFileData}
          fileData={fileData}
        />
      </div>
    </div>
  )
}
