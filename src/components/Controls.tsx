import { IconReload, IconCalculator } from "@tabler/icons-react"
import { FileProps } from "../utils/interfaces"
import { ScatterData } from "plotly.js"

interface Props {
  updateXRFData: React.Dispatch<React.SetStateAction<Partial<ScatterData>[]>>,
  currentXRFData: Partial<ScatterData>[],
  updateFileData: React.Dispatch<React.SetStateAction<FileProps[]>>,
  fileData: FileProps[],
  updateSelectedElements: React.Dispatch<React.SetStateAction<number[]>>,
  selectedElements: number[],
  updatePlotData: React.Dispatch<React.SetStateAction<Partial<ScatterData>[]>>
}

export default function Controls({ updateXRFData, currentXRFData, updateFileData, fileData, updateSelectedElements, selectedElements, updatePlotData }: Props) {
  const resetPlotData = () => {
    localStorage.clear()
    updatePlotData([])
    updateSelectedElements([])
    updateXRFData([])
    updateFileData([])
  }
  return (
    <div className="flex space-x-2">
      <span className="my-auto">
        Controls
      </span>
      <button
        onClick={resetPlotData}
        disabled={!currentXRFData.length && !fileData.length && !selectedElements.length}
        className="disabled:text-sfg text-acc">
        <IconReload />
      </button>

      <button className="disabled:text-sfg text-acc">
        <IconCalculator></IconCalculator>
      </button>

    </div>
  )
}

