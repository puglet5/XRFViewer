import FileDrawer from "./components/FileDrawer"
import { Resizable } from "re-resizable"
import { useState, useEffect, useRef } from "react"
import { FileProps, Peak, PeakData } from "./common/interfaces"
import Controls from "./components/Controls"
import PeriodicTable from "./components/PeriodicTable"
import {
  constructElementData,
  calculateElementDataScaleFactor
} from "./utils/converters"
import { useHotkeys } from "react-hotkeys-hook"
import { ScatterData } from "plotly.js"
import ScatterPlot from "./components/ScatterPlot"
import { sortElementDataByAtomicNumber } from "./utils/converters"
import { emissionLinePlotData } from "./data/emissionLinePlotData"
import { pluralize, remToPx } from "./utils/ui"
import { IconBorderAll, IconUpload } from "@tabler/icons-react"
import ModificationModal from "./components/ModificationModal"

export default function App() {
  const [selectedElements, setSelectedElements] = useState<number[]>([])
  const [currentElementData, setCurrentElementData] = useState<
    Partial<ScatterData>[]
  >([])
  const [currentXRFData, setCurrentXRFData] = useState<Partial<ScatterData>[]>(
    []
  )
  const [currentModifiedData, setCurrentModifiedData] = useState<
    Partial<ScatterData>[]
  >([])
  const [fileData, setFileData] = useState<FileProps[]>([])
  const [plotData, setPlotData] = useState<Partial<ScatterData>[]>([])
  const [periodicTableVisibility, setPeriodicTableVisibility] =
    useState<boolean>(false)
  const [modificationModalVisibility, setModificationModalVisibility] =
    useState<boolean>(false)
  const [selectedElementPoints, setSelectedElementPoints] = useState<
    (number | undefined)[][]
  >(Array.from({ length: emissionLinePlotData.length }, () => []))
  const [selectedFiles, setSelectedFiles] = useState<number[]>([])
  const [peakData, setPeakData] = useState<PeakData>({ set: [], modified: [] })

  const sidebarRef = useRef<Resizable>(null)

  useEffect(() => {
    setPlotData([
      ...currentXRFData,
      ...currentModifiedData,
      ...currentElementData
    ])
  }, [currentXRFData, currentElementData, currentModifiedData])

  useEffect(() => {
    if (currentXRFData.length) {
      localStorage.setItem("currentXRFData", JSON.stringify(currentXRFData))
    }

    if (fileData.length) {
      localStorage.setItem("fileData", JSON.stringify(fileData))
    }
  }, [currentXRFData, fileData])

  useEffect(() => {
    const elementScaleFactor = calculateElementDataScaleFactor([
      ...currentXRFData,
      ...currentModifiedData
    ])
    localStorage.setItem("selectedElements", JSON.stringify(selectedElements))
    localStorage.setItem(
      "elementScaleFactor",
      JSON.stringify(elementScaleFactor)
    )
    setCurrentElementData(
      constructElementData(
        selectedElements.sort((a, b) => a - b),
        elementScaleFactor,
        selectedElementPoints
      )
    )
    setPlotData([
      ...currentXRFData,
      ...currentModifiedData,
      ...currentElementData
    ])
  }, [selectedElements, currentXRFData, currentModifiedData])

  useEffect(() => {
    const elementScaleFactor = calculateElementDataScaleFactor(currentXRFData)
    setCurrentElementData(
      constructElementData(
        selectedElements.sort((a, b) => a - b),
        elementScaleFactor,
        selectedElementPoints
      )
    )
    setPlotData([...currentXRFData, ...currentElementData])
  }, [selectedElementPoints])

  useEffect(() => {
    const storageSelectedElementPoints = localStorage.getItem(
      "selectedElementPoints"
    )
    if (storageSelectedElementPoints) {
      const parsedStorageSelectedElementPoints: (number | undefined)[][] =
        JSON.parse(storageSelectedElementPoints)
      setSelectedElementPoints(parsedStorageSelectedElementPoints)
    }
  }, [])

  function toggleSidebar() {
    if (sidebarRef.current) {
      if (sidebarRef.current.state.width !== 0) {
        sidebarRef.current.updateSize({ width: 0, height: "auto" })
      } else {
        sidebarRef.current.updateSize({ width: 300, height: "auto" })
      }
    }
  }

  useHotkeys("esc", () => {
    setPeriodicTableVisibility(false)
  })
  useHotkeys("ctrl+p", () =>
    setPeriodicTableVisibility(!periodicTableVisibility)
  )
  useHotkeys("ctrl+b", () => {
    toggleSidebar()
    window.dispatchEvent(new Event("resize"))
  })

  if (!currentXRFData.length) {
    const storageXRFData = localStorage.getItem("currentXRFData")
    if (storageXRFData) {
      const parsedStrorageXRFData: Partial<ScatterData>[] =
        JSON.parse(storageXRFData)
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
      const parsedStorageSelectedElements: number[] = JSON.parse(
        storageSelectedElements
      )
      const parsedStorageElementScaleFactor: number = JSON.parse(
        storageElementScaleFactor
      )
      if (
        parsedStorageSelectedElements &&
        parsedStorageSelectedElements.length
      ) {
        setSelectedElements(parsedStorageSelectedElements.sort((a, b) => a - b))
        setCurrentElementData(
          constructElementData(
            selectedElements,
            parsedStorageElementScaleFactor || 1,
            selectedElementPoints
          ).sort(sortElementDataByAtomicNumber)
        )
      }
    }
  }

  if (!selectedElementPoints.length) {
    const storageSelectedElements = localStorage.getItem("selectedElements")
    const storageElementScaleFactor = localStorage.getItem("elementScaleFactor")
    if (storageSelectedElements && storageElementScaleFactor) {
      const parsedStorageSelectedElements: number[] = JSON.parse(
        storageSelectedElements
      )
      const parsedStorageElementScaleFactor: number = JSON.parse(
        storageElementScaleFactor
      )
      if (
        parsedStorageSelectedElements &&
        parsedStorageSelectedElements.length
      ) {
        setSelectedElements(parsedStorageSelectedElements.sort((a, b) => a - b))
        setCurrentElementData(
          constructElementData(
            selectedElements,
            parsedStorageElementScaleFactor || 1,
            selectedElementPoints
          ).sort(sortElementDataByAtomicNumber)
        )
      }
    }
  }

  return (
    <main className="flex h-screen bg-pbg ">
      <Resizable
        className="overflow-visible"
        bounds={"window"}
        enable={{
          top: false,
          right: true,
          bottom: false,
          left: false,
          topRight: false,
          bottomRight: false,
          bottomLeft: false,
          topLeft: false
        }}
        minWidth={0}
        snap={{
          x: [0, remToPx(4), ...Array.from({ length: 200 }, (_, i) => i + 200)]
        }}
        defaultSize={{ width: 300, height: "100%" }}
        maxWidth={400}
        handleStyles={{
          right: {
            position: "absolute",
            width: "20px",
            height: "100%",
            top: "0px",
            cursor: "col-resize",
            right: "-20px"
          }
        }}
        handleClasses={{ right: "select-none z-20" }}
        onResizeStop={() => window.dispatchEvent(new Event("resize"))}
        ref={sidebarRef}
      >
        <div className="z-20 flex h-full flex-col border-r border-ptx bg-neutral-100 @container/sidebar">
          <div className="mt-2 hidden w-full flex-col items-center justify-center text-acc @2xs/sidebar:flex ">
            <span className="text-center">
              Showing {pluralize(fileData.length, "file")}
            </span>
            {fileData.length ? (
              <span className="text-center text-xs text-gray-600">
                {fileData.filter((e) => e.isSelected === true).length} selected
              </span>
            ) : (
              <div className="pb-4"></div>
            )}
          </div>
          <div
            id="files"
            className="max-h-[50%] overflow-scroll border-ptx @2xs/sidebar:border-b"
          >
            <FileDrawer
              fileData={fileData}
              updateFileData={setFileData}
              updateXRFData={setCurrentXRFData}
              currentXRFData={currentXRFData}
              updateModifiedData={setCurrentModifiedData}
              updateModificationModalVisibility={setModificationModalVisibility}
              modificationModalVisibility={modificationModalVisibility}
              selectedFiles={selectedFiles}
              updateSelectedFiles={setSelectedFiles}
            />
          </div>

          <div id="table" className="mt-2">
            <div className="hidden items-center justify-center @[1px]/sidebar:flex @2xs/sidebar:hidden">
              <button
                onClick={() => setPeriodicTableVisibility(true)}
                disabled={periodicTableVisibility}
                className="text-acc disabled:text-sfg"
              >
                <IconBorderAll className="h-8 w-8" />
              </button>
            </div>
          </div>

          <ModificationModal
            updatePeakData={setPeakData}
            peakData={peakData}
            selectedFiles={selectedFiles}
            currentXRFData={currentXRFData}
            updateFileData={setFileData}
            updateXRFData={setCurrentXRFData}
            fileData={fileData}
            currentModifiedData={currentModifiedData}
            updateModifiedData={setCurrentModifiedData}
          />

          <div
            id="spacer"
            className="hidden flex-grow items-center justify-center @[1px]/sidebar:flex"
          ></div>

          <div
            id="reset"
            className="mt-4 hidden border-t border-ptx py-4 @[1px]/sidebar:block"
          >
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
                updateModifiedData={setCurrentModifiedData}
                currentModifiedData={currentModifiedData}
              />
            </div>
          </div>
        </div>
      </Resizable>

      <div className="h-full w-full overflow-hidden">
        <div className="h-full bg-pbg">
          <ScatterPlot
            currentXRFData={currentXRFData}
            currentModifiedData={currentModifiedData}
            peakData={peakData}
            plotData={plotData}
            elementData={currentElementData}
            updateElementData={setCurrentElementData}
            updateSelectedPoints={setSelectedElementPoints}
            selectedPoints={selectedElementPoints}
          />
        </div>
      </div>

      <PeriodicTable
        visible={periodicTableVisibility}
        updateSelectedElements={setSelectedElements}
        selectedElements={selectedElements}
      />
    </main>
  )
}
