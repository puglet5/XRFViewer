import ScatterPlot from "./components/ScatterPlot"
import { useState, useEffect } from "react"
import Uppy from '@uppy/core';
import DragDrop from '@uppy/drag-drop';
import convertDat from "./utils/converters";

export default function App() {
  const [currentPlotData, setCurrentPlotData] = useState(
    {
      datasets: []
    }
  )

  useEffect(() => {
    const uppy = new Uppy({
      autoProceed: false,
      allowMultipleUploads: true,
      allowMultipleUploadBatches: true,
      restrictions: {
        allowedFileTypes: [".dat"]
      }
    });

    uppy.use(DragDrop, { target: '#drag-drop' })
    uppy.on("files-added", (files) => {
      files.map((e) => {
        const reader = new FileReader
        reader.readAsText(e.data)
        reader.onload = () => {
          if (reader.result) {
            // @ts-expect-error
            setCurrentPlotData(prevData => ({
              datasets: [
                ...prevData.datasets,
                {
                  label: e.name.split(".")[0],
                  data: convertDat(reader.result as string)!
                }
              ]
            }))
          }
        }
      })
    })
  }, [])

  return (
    <div className="grid grid-cols-12 overflow-hidden">
      <div className="h-screen col-span-2 border bg-gray-100">
        <div className="h-32 bg-gray-200">

        </div>
        <div className="h-full" id="drag-drop">

        </div>
      </div>
      <div className="border col-span-10">
        <ScatterPlot
          plotData={currentPlotData}
        />
      </div>
    </div>
  )
}
