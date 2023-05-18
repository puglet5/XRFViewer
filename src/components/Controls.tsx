import { IconReload } from "@tabler/icons-react"
import { ChartData } from "chart.js"

interface Props {
  updatePlotData: React.Dispatch<React.SetStateAction<ChartData<'scatter'>>>,
  currentPlotData: ChartData<'scatter'>
}

export default function Controls({ updatePlotData, currentPlotData }: Props) {
  const resetPlotData = () => {
    updatePlotData({ datasets: [] })
    localStorage.removeItem("currentPlotData")
  }

  return (
    <button
    onClick={resetPlotData}
    disabled={!currentPlotData.datasets.length}
    className="disabled:text-gray-400 text-gray-600">
      <IconReload />
    </button>
  )
}

