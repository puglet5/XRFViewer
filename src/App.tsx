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
import { sortElementDataByAtomicNumber } from "./utils/converters"

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
    const elementScaleFactor = calculateElementDataScaleFactor(currentXRFData)
    localStorage.setItem("selectedElements", JSON.stringify(selectedElements))
    localStorage.setItem("elementScaleFactor", JSON.stringify(elementScaleFactor))
    setCurrentElementData(constructElementData(selectedElements.sort((a, b) => a - b), elementScaleFactor))
    setPlotData([...currentXRFData, ...currentElementData])
  }, [selectedElements, currentXRFData])

  useHotkeys("esc", () => setPeriodicTableVisibility(false))
  useHotkeys("p", () => setPeriodicTableVisibility(!periodicTableVisibility))

  if (!currentXRFData.length) {
    const storageXRFData = localStorage.getItem("currentXRFData")
    if (storageXRFData) {
      const parsedStrorageXRFData: Partial<ScatterData>[] = JSON.parse(storageXRFData)
      if (parsedStrorageXRFData && parsedStrorageXRFData.length) {
        setCurrentXRFData(parsedStrorageXRFData)
      }
    }
  }

  if (!fileData.length) {
    const storageFileData = localStorage.getItem("fileData")
    if (storageFileData) {
      const parsedStorageFileData: FileProps[] = JSON.parse(storageFileData)
      if (parsedStorageFileData && parsedStorageFileData.length) {
        setFileData(parsedStorageFileData)
      }
    }
  }

  if (!selectedElements.length) {
    const storageSelectedElements = localStorage.getItem("selectedElements")
    const storageElementScaleFactor = localStorage.getItem("elementScaleFactor")
    if (storageSelectedElements && storageElementScaleFactor) {
      const parsedStorageSelectedElements: number[] = JSON.parse(storageSelectedElements)
      const parsedStorageElementScaleFactor: number = JSON.parse(storageElementScaleFactor)
      if (parsedStorageSelectedElements && parsedStorageSelectedElements.length) {
        console.log(parsedStorageSelectedElements.sort((a, b) => a - b))
        setSelectedElements(parsedStorageSelectedElements.sort((a, b) => a - b))
        setCurrentElementData(constructElementData(selectedElements, parsedStorageElementScaleFactor || 1).sort(sortElementDataByAtomicNumber))
      }
    }
  }


  return (
    <main className="grid grid-cols-12 bg-pbg h-screen ">
      <div className="col-span-2 bg-pbg">
        <div className="h-32 border-b border-ptx flex items-center justify-center">
          <Controls
            updateXRFData={setCurrentXRFData}
            updatePeriodicTableVisibility={setPeriodicTableVisibility}
            updateFileData={setFileData}
            updateSelectedElements={setSelectedElements}
            updatePlotData={setPlotData}
            currentXRFData={currentXRFData}
            periodicTableVisibility={periodicTableVisibility}
            selectedElements={selectedElements}
            fileData={fileData}
          />
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
        <div className="border-l border-ptx bg-pbg 2xl:h-1/2 h-full">
          <ScatterPlot
            plotData={plotData}
            elementData={currentElementData}
            updateElementData={setCurrentElementData}
          />
        </div>
        <div>
          <PeriodicTable visible={periodicTableVisibility} updateSelectedElements={setSelectedElements} selectedElements={selectedElements} />
        </div>
      </div>
    </main >
  )
}
