import ScatterPlot from "./components/ScatterPlot"
import FileDrawer from "./components/FileDrawer"
import { useState, useEffect } from "react"
import { FileProps } from "./utils/interfaces"
import Uploader from "./components/Uploader"
import Controls from "./components/Controls"
import { ChartData } from 'chart.js'
import { elementSymbols, emissionLinesData } from "./data/elementData"
import { emissionLinePlotData, emissionLinePlotLabels } from "./data/emissionLinePlotData"

const constructPlotData = (...args: ChartData<"scatter">[]): ChartData<"scatter"> => {
  let plotData = {
    datasets: args.flatMap((e) => e.datasets)
  }
  return plotData
}

const constructElementData = (atomicNumbers: number[]): ChartData<"scatter"> => {
  let elementIndices = atomicNumbers.map((e) => emissionLinesData.elements.findIndex(x => x.atomicNumber === e)).filter((e) => e >= 0)

  let elements = elementIndices.map((i) => emissionLinesData.elements[i])

  let elementData = {
    datasets: elementIndices.flatMap((e, i) => {
      return {
        showLine: true,
        label: elements[i].symbol,
        pointRadius: 0,
        pointHoverRadius: 0,
        pointHitRadius: 0,
        data: emissionLinePlotData[e],
        datalabels: {
          anchor: "center",
          align: "top",
          clip: true,
          borderRadius: 2,
          backgroundColor: "rgba(255, 255, 255, .75)",
          labels: {
            value: {},
            title: {
              color: "black",
            }
          },
          display: (context: any) => {
            if (context.dataIndex % 3 - 1 === 0)
              return "auto"
            else
              return false
          },
          formatter: (value: any, context: any) => {
            let label = parseFloat(value["x"]).toFixed(2)
            return label
          }
        },
      }
    })
  }

  if (!elementData.datasets.length) return { datasets: [] }
  return elementData as ChartData<"scatter">
}

export default function App() {
  const [selectedElements, setSelectedElements] = useState<number[]>([])
  const [currentElementData, setCurrentElementData] = useState<ChartData<'scatter'>>({ datasets: [] })
  const [currentXRFData, setCurrentXRFData] = useState<ChartData<'scatter'>>({
    datasets: []
  })
  const [fileData, setFileData] = useState<FileProps[]>([])
  const [plotData, setPlotData] = useState<ChartData<'scatter'>>({ datasets: [] })

  useEffect(() => {
    if (currentXRFData.datasets.length) {
      localStorage.setItem("currentXRFData", JSON.stringify(currentXRFData))
    }

    if (fileData.length) {
      localStorage.setItem("fileData", JSON.stringify(fileData))
    }
  }, [currentXRFData, fileData])
  useEffect(() => {
    localStorage.setItem("selectedElements", JSON.stringify(selectedElements))
    setCurrentElementData(constructElementData(selectedElements))
  }, [selectedElements, setPlotData])
  useEffect(() => {
    setPlotData(constructPlotData(currentXRFData, currentElementData))
  }, [currentXRFData, currentElementData])


  if (!currentXRFData.datasets.length) {
    let storageXRFData = localStorage.getItem("currentXRFData")
    let parsedStrorageXRFData = JSON.parse(storageXRFData!)
    if (parsedStrorageXRFData) {
      if ("datasets" in parsedStrorageXRFData && parsedStrorageXRFData.datasets.length) {
        setCurrentXRFData(parsedStrorageXRFData)
      }
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
    let parsedStorageSelectedElements = JSON.parse(storageSelectedElements!)
    if (parsedStorageSelectedElements && parsedStorageSelectedElements.length) {
      setSelectedElements(parsedStorageSelectedElements)
      setCurrentElementData(constructElementData(selectedElements))
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
        <div className="pr-4 border-l border-ptx bg-pbg">
          <ScatterPlot
            plotData={plotData}
          />
        </div>
      </div>
    </main >
  )
}
