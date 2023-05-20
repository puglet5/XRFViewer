import FileDrawer from "./components/FileDrawer"
import { useState, useEffect } from "react"
import { FileProps } from "./utils/interfaces"
import Uploader from "./components/Uploader"
import Controls from "./components/Controls"
import PeriodicTable from "./components/PeriodicTable"
import { constructElementData, calculateElementDataScaleFactor } from "./utils/converters"
import { useHotkeys } from 'react-hotkeys-hook'
import { ScatterData } from "plotly.js"
import ScatterPlot from "./components/ScatterPlot"

export default function App() {
  const [selectedElements, setSelectedElements] = useState<number[]>([])
  const [currentElementData, setCurrentElementData] = useState<Partial<ScatterData>[]>([])
  const [currentXRFData, setCurrentXRFData] = useState<Partial<ScatterData>[]>([])
  const [fileData, setFileData] = useState<FileProps[]>([])
  const [plotData, setPlotData] = useState<Partial<ScatterData>[]>([])
  const [periodicTableVisibility, setPeriodicTableVisibility] = useState<boolean>(false)

  useEffect(() => {
    setPlotData([...currentXRFData, ...currentElementData])
  }, [currentXRFData, currentElementData])

  useEffect(() => {
    if (currentXRFData.length) {
      localStorage.setItem("currentXRFData", JSON.stringify(currentXRFData))
    }

    if (fileData.length) {
      localStorage.setItem("fileData", JSON.stringify(fileData))
    }
  }, [currentXRFData, fileData])

  useEffect(() => {
    let elementScaleFactor = calculateElementDataScaleFactor(currentXRFData)
    localStorage.setItem("selectedElements", JSON.stringify(selectedElements))
    localStorage.setItem("elementScaleFactor", JSON.stringify(elementScaleFactor))
    setCurrentElementData(constructElementData(selectedElements, elementScaleFactor))
    setPlotData([...currentXRFData, ...currentElementData])
  }, [selectedElements, currentXRFData])

  useHotkeys("ctrl+p", () => setPeriodicTableVisibility(!periodicTableVisibility))

  if (!currentXRFData.length) {
    let storageXRFData = localStorage.getItem("currentXRFData")
    let parsedStrorageXRFData = JSON.parse(storageXRFData!)
    if (parsedStrorageXRFData && parsedStrorageXRFData.length) {
      setCurrentXRFData(parsedStrorageXRFData)
    }
  }

  if (!fileData.length) {
    let storageFileData = localStorage.getItem("fileData")
    let parsedStorageFileData = JSON.parse(storageFileData!)
    if (parsedStorageFileData && parsedStorageFileData.length) {
      setFileData(parsedStorageFileData)
    }
  }

  if (!selectedElements.length) {
    let storageSelectedElements = localStorage.getItem("selectedElements")
    let storageElementScaleFactor = localStorage.getItem("elementScaleFactor")
    let parsedStorageSelectedElements: number[] = JSON.parse(storageSelectedElements!)
    let parsedStorageElementScaleFactor: number = JSON.parse(storageElementScaleFactor!)
    if (parsedStorageSelectedElements && parsedStorageSelectedElements.length) {
      setSelectedElements(parsedStorageSelectedElements)
      setCurrentElementData(constructElementData(selectedElements, parsedStorageElementScaleFactor || 1))
    }
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
          updateXRFData={setCurrentXRFData}
          currentXRFData={currentXRFData}
        />

        <div>
          <Uploader
            updateXRFData={setCurrentXRFData}
            updateFileData={setFileData}
            fileData={fileData}
          />
        </div>
      </div>
      <div className="col-span-10">
        <div className="h-16 bg-pbg flex p-8 border-b border-l border-ptx">
          <div className="flex items-center justify-center ">
            <Controls
              updateXRFData={setCurrentXRFData}
              updateFileData={setFileData}
              updateSelectedElements={setSelectedElements}
              updatePlotData={setPlotData}
              currentXRFData={currentXRFData}
              selectedElements={selectedElements}
              fileData={fileData}
            />
          </div>
        </div>
        <div className="border-l border-ptx bg-pbg h-[48rem]">
          <ScatterPlot plotData={plotData} />
        </div>
        <div>
          <PeriodicTable visible={periodicTableVisibility} updateSelectedElements={setSelectedElements} selectedElements={selectedElements} />
        </div>
      </div>
    </main >
  )
}
