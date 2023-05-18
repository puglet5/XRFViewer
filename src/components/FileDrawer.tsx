import { FileProps } from "../utils/interfaces"
import { IconFile } from "@tabler/icons-react"
import File from "./File"
import { ChartData } from "chart.js"
import { IconX } from "@tabler/icons-react"

interface Props {
  updatePlotData: React.Dispatch<React.SetStateAction<ChartData<'scatter'>>>,
  plotData: ChartData<'scatter'>,
  updateFileData: React.Dispatch<React.SetStateAction<FileProps[]>>,
  fileData: FileProps[]
}

export default function FileDrawer({ fileData, updateFileData, updatePlotData, plotData }: Props) {
  const removeFile = (index: number) => {
    let newFileData = fileData.filter((_e, i) => i != index)
    let newPlotData = {
      datasets: plotData.datasets.filter((_e, i) => i != index)
    }
    localStorage.setItem("fileData", JSON.stringify(newFileData))
    localStorage.setItem("currentPlotData", JSON.stringify(newPlotData))
    updateFileData(newFileData)
    updatePlotData(newPlotData)
  }

  const constructFileDrawer = (data: FileProps[]) => {
    return data.map((e, i) => {
      return (
        <div className="text-sm flex justify-between" key={e.id}>
          <div className="flex space-x-2">
            <IconFile className="w-4 h-4 my-auto" />
            <File fileData={e} />
          </div>
          <button onClick={() => removeFile(i)}>
            <IconX />
          </button>
        </div>
      )
    })
  }

  return (
    <div className="p-2 border-b border-ptx flex flex-col">
      <span className="text-center">
        Showing {fileData.length} files
      </span>
      <div>
        {constructFileDrawer(fileData)}
      </div>
    </div>
  )
}


