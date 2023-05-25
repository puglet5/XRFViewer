import FileDrawer from "./components/FileDrawer"
import { Resizable, ResizableProps } from 're-resizable'
import { useState, useEffect, useRef } from "react"
import { FileProps } from "./utils/interfaces"
import Uploader from "./components/Uploader"
import Controls from "./components/Controls"
import PeriodicTable from "./components/PeriodicTable"
import { constructElementData, calculateElementDataScaleFactor } from "./utils/converters"
import { useHotkeys } from 'react-hotkeys-hook'
import { ScatterData } from "plotly.js"
import ScatterPlot from "./components/ScatterPlot"
import { sortElementDataByAtomicNumber } from "./utils/converters"
import { emissionLinePlotData } from "./data/emissionLinePlotData"
import { pluralize, remToPx } from "./utils/ui"
import { IconBorderAll, IconUpload } from "@tabler/icons-react"


export default function App() {
  const [selectedElements, setSelectedElements] = useState<number[]>([])
  const [currentElementData, setCurrentElementData] = useState<Partial<ScatterData>[]>([])
  const [currentXRFData, setCurrentXRFData] = useState<Partial<ScatterData>[]>([])
  const [fileData, setFileData] = useState<FileProps[]>([])
  const [plotData, setPlotData] = useState<Partial<ScatterData>[]>([])
  const [periodicTableVisibility, setPeriodicTableVisibility] = useState<boolean>(false)
  const [selectedElementPoints, setSelectedElementPoints] = useState<(number | undefined)[][]>(Array.from({ length: emissionLinePlotData.length }, () => []))
  const sidebarRef = useRef<Resizable>(null)

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
    setCurrentElementData(constructElementData(selectedElements.sort((a, b) => a - b), elementScaleFactor, selectedElementPoints))
    setPlotData([...currentXRFData, ...currentElementData])
  }, [selectedElements, currentXRFData])

  useEffect(() => {
    const elementScaleFactor = calculateElementDataScaleFactor(currentXRFData)
    setCurrentElementData(constructElementData(selectedElements.sort((a, b) => a - b), elementScaleFactor, selectedElementPoints))
    setPlotData([...currentXRFData, ...currentElementData])
  }, [selectedElementPoints])

  useEffect(() => {
    const storageSelectedElementPoints = localStorage.getItem("selectedElementPoints")
    if (storageSelectedElementPoints) {
      const parsedStorageSelectedElementPoints: (number | undefined)[][] = JSON.parse(storageSelectedElementPoints)
      setSelectedElementPoints(parsedStorageSelectedElementPoints)
    }
  }, [])

  const toggleSidebar = () => {
    if (sidebarRef.current) {
      if (sidebarRef.current.state.width !== 0) {
        sidebarRef.current.updateSize({ width: 0, height: "auto" })
      } else {
        sidebarRef.current.updateSize({ width: 300, height: "auto" })
      }
    }
  }

  useHotkeys("esc", () => setPeriodicTableVisibility(false))
  useHotkeys("ctrl+p", () => setPeriodicTableVisibility(!periodicTableVisibility))
  useHotkeys("ctrl+b", () => {
    toggleSidebar()
    window.dispatchEvent(new Event('resize'))
  })

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
        setSelectedElements(parsedStorageSelectedElements.sort((a, b) => a - b))
        setCurrentElementData(constructElementData(selectedElements, parsedStorageElementScaleFactor || 1, selectedElementPoints).sort(sortElementDataByAtomicNumber))
      }
    }
  }

  if (!selectedElementPoints.length) {
    const storageSelectedElements = localStorage.getItem("selectedElements")
    const storageElementScaleFactor = localStorage.getItem("elementScaleFactor")
    if (storageSelectedElements && storageElementScaleFactor) {
      const parsedStorageSelectedElements: number[] = JSON.parse(storageSelectedElements)
      const parsedStorageElementScaleFactor: number = JSON.parse(storageElementScaleFactor)
      if (parsedStorageSelectedElements && parsedStorageSelectedElements.length) {
        setSelectedElements(parsedStorageSelectedElements.sort((a, b) => a - b))
        setCurrentElementData(constructElementData(selectedElements, parsedStorageElementScaleFactor || 1, selectedElementPoints).sort(sortElementDataByAtomicNumber))
      }
    }
  }

  return (
    <main className="flex bg-pbg h-screen ">
      <Resizable
        className=""
        bounds={"window"}
        enable={{ top: false, right: true, bottom: false, left: false, topRight: false, bottomRight: false, bottomLeft: false, topLeft: false }}
        minWidth={0}
        snap={{ x: [0, remToPx(4), ...Array.from({ length: 200 }, (_v, i) => i + 200)] }}
        defaultSize={{ width: 300, height: "100%" }}
        maxWidth={400}
        handleStyles={{ right: { position: "absolute", width: "20px", height: "100%", top: "0px", cursor: "col-resize", right: "-20px" } }}
        handleClasses={{ right: "select-none z-20" }}
        onResizeStop={() => window.dispatchEvent(new Event('resize'))}
        ref={sidebarRef}
      >
        <div className="h-full @container/sidebar bg-neutral-100 border-r border-ptx flex flex-col z-20">
          <div className="w-full text-acc justify-center items-center flex-col mt-2 @2xs/sidebar:flex hidden ">
            <span className="text-center">
              Showing {pluralize(fileData.length, "file")}
            </span>
            {fileData.length ?
              <span className="text-center text-xs text-gray-600">
                {fileData.filter(e => e.isSelected === true).length} selected
              </span>
              : <div className="pb-4"></div>
            }
          </div>
          <div id="files" className="max-h-[50%] overflow-scroll border-ptx @2xs/sidebar:border-b">
            <FileDrawer
              fileData={fileData}
              updateFileData={setFileData}
              updateXRFData={setCurrentXRFData}
              currentXRFData={currentXRFData}
            />
          </div>

          <div id="table" className="mt-2">
            <div className="@2xs/sidebar:hidden items-center justify-center @[1px]/sidebar:flex hidden">
              <button
                onClick={() => setPeriodicTableVisibility(true)}
                disabled={periodicTableVisibility}
                className="disabled:text-sfg text-acc">
                <IconBorderAll className="w-8 h-8" />
              </button>
            </div>
          </div>

          <div id="uploader" className="mt-2 h-48">
            <div className="@2xs/sidebar:flex hidden items-center justify-center h-full">
              <div className="w-full h-full flex-grow items-center justify-center m-4">
                <Uploader
                  updateXRFData={setCurrentXRFData}
                  updateFileData={setFileData}
                  fileData={fileData}
                />
              </div>
            </div>
            <div className="@[1px]/sidebar:flex hidden items-center justify-center">
              <div className="@2xs/sidebar:hidden flex items-center justify-center text-acc">
                <IconUpload className="w-8 h-8"></IconUpload>
              </div>
            </div>
          </div>

          <div id="spacer" className="@[1px]/sidebar:flex hidden flex-grow items-center justify-center">

          </div>

          <div id="reset" className="@[1px]/sidebar:block hidden border-t py-4 border-ptx mt-4">
            <div className="flex items-center justify-center">
              <Controls
                updateXRFData={setCurrentXRFData}
                updatePeriodicTableVisibility={setPeriodicTableVisibility}
                updateFileData={setFileData}
                updateSelectedElements={setSelectedElements}
                updateSelectedElementPoints={setSelectedElementPoints}
                updatePlotData={setPlotData}
                currentXRFData={currentXRFData}
                periodicTableVisibility={periodicTableVisibility}
                selectedElements={selectedElements}
                selectedElementPoints={selectedElementPoints}
                fileData={fileData}
              />
            </div>
          </div>
        </div>
      </Resizable>


      <div className="w-full overflow-hidden h-full">
        <div className="bg-pbg h-full">
          <ScatterPlot
            plotData={plotData}
            elementData={currentElementData}
            updateElementData={setCurrentElementData}
            updateSelectedPoints={setSelectedElementPoints}
            selectedPoints={selectedElementPoints}
          />
        </div>
        <PeriodicTable visible={periodicTableVisibility} updateSelectedElements={setSelectedElements} selectedElements={selectedElements} />
      </div>
    </main >
  )
}
