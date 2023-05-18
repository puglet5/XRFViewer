import ScatterPlot from "./components/ScatterPlot"
import FileDrawer from "./components/FileDrawer";
import { useState, useEffect } from "react"
import { FileProps } from "./utils/interfaces";
import Uploader from "./components/Uploader";
import Controls from "./components/Controls";
import type { ChartData } from 'chart.js';


export default function App() {
  const [currentPlotData, setCurrentPlotData] = useState<ChartData<'scatter'>>({ datasets: [] })
  const [fileData, setFileData] = useState<FileProps[]>([])

  useEffect(() => {
    if (currentPlotData.datasets.length) {
      localStorage.setItem("currentPlotData", JSON.stringify(currentPlotData))
    }

    if (fileData.length) {
      localStorage.setItem("fileData", JSON.stringify(fileData))
    }
  }, [currentPlotData, fileData])

  if (!currentPlotData.datasets.length) {
    let storagePlotData = localStorage.getItem("currentPlotData")
    let parsedStroragePlotData = JSON.parse(storagePlotData!)
    if (parsedStroragePlotData) {
      if ("datasets" in parsedStroragePlotData && parsedStroragePlotData.datasets.length) {
        setCurrentPlotData(parsedStroragePlotData)
      }
    }
  }

  if (!fileData.length) {
    let storageFileData = localStorage.getItem("fileData")
    let parsedStorageFileData = JSON.parse(storageFileData!)
    if (parsedStorageFileData && parsedStorageFileData.length) setFileData(parsedStorageFileData)
  }

  return (
    <main className="grid grid-cols-12 bg-pbg h-screen ">
      <div className="col-span-2 bg-pbg">
        <div className="h-32 border-b border-ptx flex items-center justify-center">
          <span>Info</span>
        </div>
        <FileDrawer
          fileData={fileData}
          updateFileData={setFileData}
          updatePlotData={setCurrentPlotData}
          plotData={currentPlotData}
        />

        <div>
          <Uploader
            updatePlotData={setCurrentPlotData}
            updateFileData={setFileData}
            fileData={fileData}
          />
        </div>
      </div>
      <div className="col-span-10">
        <div className="h-16 bg-pbg flex p-8 border-b border-l border-ptx">
          <div className="flex items-center justify-center ">
            <Controls
              updatePlotData={setCurrentPlotData}
              currentPlotData={currentPlotData}
              updateFileData={setFileData}
              fileData={fileData}
            />
          </div>
        </div>
        <div className="pr-4 border-l border-ptx bg-pbg">
          <ScatterPlot
            plotData={currentPlotData}
          />
        </div>
      </div>
    </main >
  )
}
