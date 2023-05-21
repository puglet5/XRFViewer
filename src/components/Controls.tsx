import { IconReload } from "@tabler/icons-react"
import { FileProps } from "../utils/interfaces"
import { ScatterData } from "plotly.js"
import { IconBorderAll } from "@tabler/icons-react"


interface Props {
  updateXRFData: React.Dispatch<React.SetStateAction<Partial<ScatterData>[]>>,
  currentXRFData: Partial<ScatterData>[],
  updateFileData: React.Dispatch<React.SetStateAction<FileProps[]>>,
  fileData: FileProps[],
  updateSelectedElements: React.Dispatch<React.SetStateAction<number[]>>,
  selectedElements: number[],
  periodicTableVisibility: boolean
  updatePlotData: React.Dispatch<React.SetStateAction<Partial<ScatterData>[]>>
  updatePeriodicTableVisibility: React.Dispatch<React.SetStateAction<boolean>>
}

export default function Controls({ updateXRFData, currentXRFData, updateFileData, fileData, updateSelectedElements, selectedElements, updatePlotData, updatePeriodicTableVisibility, periodicTableVisibility }: Props) {
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
      </span>
      <button
        onClick={resetPlotData}
        disabled={!currentXRFData.length && !fileData.length && !selectedElements.length}
        className="disabled:text-sfg text-acc">
        <IconReload />
      </button>
      <button
        onClick={() => updatePeriodicTableVisibility(true)}
        disabled={periodicTableVisibility}
        className="disabled:text-sfg text-acc">
        <IconBorderAll/>
      </button>

    </div>
  )
}

