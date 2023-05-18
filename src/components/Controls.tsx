import { IconReload, IconCalculator } from "@tabler/icons-react"
import { ChartData } from "chart.js"
import { FileProps } from "../utils/interfaces"

interface Props {
  updatePlotData: React.Dispatch<React.SetStateAction<ChartData<'scatter'>>>,
  currentPlotData: ChartData<'scatter'>,
  updateFileData: React.Dispatch<React.SetStateAction<FileProps[]>>,
  fileData: FileProps[]
}

export default function Controls({ updatePlotData, currentPlotData, updateFileData, fileData }: Props) {
  const resetPlotData = () => {
    updatePlotData({ datasets: [] })
    updateFileData([])
    localStorage.removeItem("currentPlotData")
    localStorage.removeItem("fileData")
  }

  return (
    <div className="flex space-x-2">
      <span>
        Controls
      </span>
      <button
        onClick={resetPlotData}
        disabled={!currentPlotData.datasets.length && !fileData.length}
        className="disabled:text-sfg text-acc">
        <IconReload />
      </button>

      <button className="disabled:text-sfg text-acc">
        <IconCalculator></IconCalculator>
      </button>

    </div>
  )
}

