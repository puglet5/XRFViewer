import { IconReload, IconCalculator } from "@tabler/icons-react"
import { ChartData } from "chart.js"
import { FileProps } from "../utils/interfaces"

interface Props {
  updateXRFData: React.Dispatch<React.SetStateAction<ChartData<'scatter'>>>,
  currentXRFData: ChartData<'scatter'>,
  updateFileData: React.Dispatch<React.SetStateAction<FileProps[]>>,
  fileData: FileProps[],
  updateSelectedElements: React.Dispatch<React.SetStateAction<number[]>>,
  selectedElements: number[],
  updatePlotData: React.Dispatch<React.SetStateAction<ChartData<'scatter'>>>
}

export default function Controls({ updateXRFData, currentXRFData, updateFileData, fileData, updateSelectedElements, selectedElements, updatePlotData }: Props) {
  const resetPlotData = () => {
    localStorage.clear()
    updatePlotData({ datasets: [] })
    updateSelectedElements([])
    updateXRFData({ datasets: [] })
    updateFileData([])
  }
  return (
    <div className="flex space-x-2">
      <span className="my-auto">
        Controls
      </span>
      <button
        onClick={resetPlotData}
        disabled={!currentXRFData.datasets.length && !fileData.length && !selectedElements.length}
        className="disabled:text-sfg text-acc">
        <IconReload />
      </button>

      <button className="disabled:text-sfg text-acc">
        <IconCalculator></IconCalculator>
      </button>

    </div>
  )
}

