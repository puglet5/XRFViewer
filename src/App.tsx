import ScatterPlot from "./components/ScatterPlot"
import FileDrawer from "./components/FileDrawer";
import { useState, useEffect } from "react"
import { FileProps } from "./utils/interfaces";
import Uploader from "./components/Uploader";
import type { ChartData } from 'chart.js';


export default function App() {
  const [currentPlotData, setCurrentPlotData] = useState<ChartData<'scatter'>>({ datasets: [] })
  const [fileProps, setFileProps] = useState<FileProps[]>([])

  useEffect(() => {
    console.log(fileProps)
  }, [fileProps])


  return (
    <main className="grid grid-cols-12 overflow-hidden">
      <div className="h-screen col-span-2 border bg-gray-100">
        <FileDrawer />
        <Uploader
          updatePlotData={setCurrentPlotData}
          updateFileProps={setFileProps}
          fileProps={fileProps}
        />
      </div>
      <div className="col-span-10 border">
        <div className="h-32 bg-neutral-100 flex p-8 border">
          <span className="text-lg">
            Controls
          </span>
        </div>
        <div className="pr-4">
          <ScatterPlot
            plotData={currentPlotData}
          />
        </div>
      </div>
    </main >
  )
}
