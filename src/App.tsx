import { IconBorderAll } from "@tabler/icons-react"
import { ScatterData, SelectionRange } from "plotly.js"
import { Resizable } from "re-resizable"
import { useEffect, useRef, useState, createContext, useMemo } from "react"
import { useHotkeys } from "react-hotkeys-hook"
import { XRFData } from "./common/interfaces"
import Controls from "./components/Controls"
import FileDrawer from "./components/FileDrawer"
import ModificationModal from "./components/ModificationModal"
import PeriodicTable from "./components/PeriodicTable"
import ScatterPlot from "./components/ScatterPlot"
import {
  calculateElementDataScaleFactor,
  constructElementData
} from "./utils/converters"
import { pluralize, remToPx } from "./utils/ui"

type DataContextType = {
  data: XRFData[]
  setData: React.Dispatch<React.SetStateAction<XRFData[]>>
}

const IDataContext = {
  data: [],
  setData: () => {}
}

export const DataContext = createContext<DataContextType>(IDataContext)

export default function App() {
  const [selectedElements, setSelectedElements] = useState<number[]>(
    JSON.parse(localStorage.getItem("selectedElements") ?? "[]")
  )
  const [currentElementData, setCurrentElementData] = useState<
    Partial<ScatterData>[]
  >([])
  const [plotData, setPlotData] = useState<Partial<ScatterData>[]>([])
  const [periodicTableVisibility, setPeriodicTableVisibility] =
    useState<boolean>(false)
  const [data, setData] = useState<XRFData[]>(
    JSON.parse(localStorage.getItem("data") ?? "[]")
  )

  const dataContextState = useMemo(() => ({ data, setData }), [data])

  const [elementScaleFactor, setElementScaleFactor] = useState<number>(
    JSON.parse(localStorage.getItem("elementScaleFactor") ?? "1")
  )
  const [selectedRange, setSelectedRange] = useState<SelectionRange | null>(
    null
  )
  const [selectedPoints, setSelectedPoints] = useState<number[]>(
    JSON.parse(localStorage.getItem("selectedPoints")!) ?? []
  )

  const sidebarRef = useRef<Resizable>(null)

  useEffect(() => {
    setPlotData([
      ...data.flatMap((e) => [
        e.plotData.main,
        ...(e.plotData.deconvolutions ?? [])
      ]),
      ...currentElementData
    ])
  }, [data, currentElementData])

  useEffect(() => {
    localStorage.setItem("data", JSON.stringify(data))
  }, [data])

  useEffect(() => {
    localStorage.setItem("selectedElements", JSON.stringify(selectedElements))
  }, [selectedElements])

  useEffect(() => {
    localStorage.setItem(
      "elementScaleFactor",
      JSON.stringify(elementScaleFactor)
    )
  }, [elementScaleFactor])

  useEffect(() => {
    if (selectedElements.length) {
      const elementScaleFactor = calculateElementDataScaleFactor(
        data.map((e) => e.data.original.y)
      )
      setElementScaleFactor(elementScaleFactor)
      setCurrentElementData(
        constructElementData(
          selectedElements.sort((a, b) => a - b),
          elementScaleFactor
        )
      )
    }
  }, [data])

  useEffect(() => {
    if (selectedElements.length) {
      const elementScaleFactor = calculateElementDataScaleFactor(
        data.map((e) => e.data.original.y)
      )
      setElementScaleFactor(elementScaleFactor)
      setCurrentElementData(
        constructElementData(
          selectedElements.sort((a, b) => a - b),
          elementScaleFactor
        )
      )
    } else {
      setElementScaleFactor(1)
      setCurrentElementData([])
    }
  }, [selectedElements])

  function toggleSidebar() {
    if (sidebarRef.current) {
      if (sidebarRef.current.state.width !== 0) {
        sidebarRef.current.updateSize({ width: 0, height: "auto" })
      } else {
        sidebarRef.current.updateSize({ width: 300, height: "auto" })
      }
    }
  }

  useHotkeys(
    "esc",
    () => {
      setPeriodicTableVisibility(false)
    },
    { enableOnContentEditable: true, enableOnFormTags: true }
  )
  useHotkeys(
    "ctrl+p",
    () => {
      setPeriodicTableVisibility(!periodicTableVisibility)
    },
    { enableOnContentEditable: true, enableOnFormTags: true }
  )
  useHotkeys(
    "ctrl+b",
    () => {
      toggleSidebar()
      window.dispatchEvent(new Event("resize"))
    },
    { enableOnContentEditable: true, enableOnFormTags: true }
  )

  return (
    <main className="flex h-screen bg-pbg ">
      <DataContext.Provider value={dataContextState}>
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
            x: [
              0,
              remToPx(4),
              ...Array.from({ length: 200 }, (_, i) => i + 200)
            ]
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
              <span className="select-none text-center">
                Showing {pluralize(data.length, "file")}
              </span>
              {data.length ? (
                <span className="select-none text-center text-xs text-gray-600">
                  {data.filter((e) => e.isSelected === true).length} selected
                </span>
              ) : (
                <div className="pb-4"></div>
              )}
            </div>
            <div
              id="files"
              className="max-h-[50%] overflow-scroll border-ptx @2xs/sidebar:border-b"
            >
              <FileDrawer />
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
              selectedRange={selectedRange}
              selectedPoints={selectedPoints}
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
                  updateSelectedElements={setSelectedElements}
                  selectedElements={selectedElements}
                />
              </div>
            </div>
          </div>
        </Resizable>

        <div className="h-full w-full overflow-hidden">
          <div className="h-full bg-pbg">
            <ScatterPlot
              plotData={plotData}
              selectedRange={selectedRange}
              setSelectedRange={setSelectedRange}
              selectedPoints={selectedPoints}
              setSelectedPoints={setSelectedPoints}
            />
          </div>
        </div>
      </DataContext.Provider>

      <PeriodicTable
        visible={periodicTableVisibility}
        updateSelectedElements={setSelectedElements}
        selectedElements={selectedElements}
      />
    </main>
  )
}
