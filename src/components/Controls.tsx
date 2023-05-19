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
    localStorage.removeItem("selectedElements")
    localStorage.removeItem("currentXRFData")
    localStorage.removeItem("fileData")
    updatePlotData({ datasets: [] })
    updateSelectedElements([])
    updateXRFData({ datasets: [] })
    updateFileData([])
  }

  const handleElementInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let elements = e.target.value.split(",").map(i => Number(i))
    updateSelectedElements(elements)
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

      <input
        type="text"
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        onChange={handleElementInput}
        value={selectedElements.toString()}
      />

    </div>
  )
}

