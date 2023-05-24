import { FileProps } from "../utils/interfaces"
import { IconCsv, IconFile, IconX } from "@tabler/icons-react"
import File from "./File"
import { Datum, ScatterData } from "plotly.js"
import { useState } from "react"

interface Props {
  updateXRFData: React.Dispatch<React.SetStateAction<Partial<ScatterData>[]>>,
  currentXRFData: Partial<ScatterData>[],
  updateFileData: React.Dispatch<React.SetStateAction<FileProps[]>>,
  fileData: FileProps[]
}

export default function FileDrawer({ fileData, updateFileData, updateXRFData, currentXRFData }: Props) {
  const [selectedFiles, setSelectedFiles] = useState<number[]>([])
  const removeFile = (fileIndex: number) => {
    const newFileData = fileData.filter((_e, i) => i != fileIndex)
    const newXRFData = currentXRFData.filter((_e, i) => i != fileIndex)
    localStorage.setItem("fileData", JSON.stringify(newFileData))
    localStorage.setItem("currentXRFData", JSON.stringify(newXRFData))
    updateFileData(newFileData)
    updateXRFData(newXRFData)
  }

  const toggleFileSelection = (fileIndex: number) => {
    const newFileData = fileData
    newFileData[fileIndex].isSelected = !newFileData[fileIndex].isSelected
    localStorage.setItem("fileData", JSON.stringify(newFileData))
    updateFileData(newFileData)
    setSelectedFiles(newFileData.flatMap((e, i) => e.isSelected ? i : []))
  }

  const downloadCSV = (fileIndex: number) => {
    const data = currentXRFData[fileIndex]
    if (data.x && data.y) {
      // @ts-ignore
      const csvData = data.x.map((e, i) => { return [e, data.y[i]].join(",") }).join('\n')
      const blob = new Blob([csvData], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.setAttribute('href', url)
      a.setAttribute('download', `${fileData[fileIndex].name.split(".")[0]}.csv`);
      a.click()
    }
  }

  const constructFileDrawer = (data: FileProps[]) => {
    return data.map((e, i) => {
      return (
        <div className="text-sm flex justify-between" key={e.id}>
          <div className="grid grid-cols-12 space-x-2 w-full items-center">
            <button onClick={() => toggleFileSelection(i)}>
              <IconFile className="w-4 h-4 my-auto col-span-1 mx-auto lg:block hidden" />
            </button>
            <File fileData={e} isSelected={e.isSelected} />
            <button onClick={() => removeFile(i)} className="col-span-1 mx-auto place-self-end">
              <IconX />
            </button>
            <button onClick={() => downloadCSV(i)} className="col-span-1 mx-auto place-self-end">
              <IconCsv />
            </button>
          </div>
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


