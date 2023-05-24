import { FileProps } from "../utils/interfaces"
import { IconCsv, IconX, IconFiles } from "@tabler/icons-react"
import File from "./File"
import { ScatterData } from "plotly.js"
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
      a.setAttribute('download', `${fileData[fileIndex].name.split(".")[0]}.csv`)
      a.click()
    }
  }

  const pluralize = (count: number, noun: string, suffix = "s") =>
    `${count} ${noun}${count !== 1 ? suffix : ""}`

  const constructFileDrawer = (data: FileProps[]) => {
    return data.map((e, i) => {
      return (
        <div key={e.id}>
          <div className="flex w-full h-full flex-nowrap ">
            <button
              onClick={() => toggleFileSelection(i)}
              className="font-medium my-auto"
            >
              {/* <IconFile className="w-4 h-4 my-auto col-span-1 mx-auto" /> */}
              <span className="p-1 bg-indigo-200 aspect-square rounded-sm mr-2">
                {e.type.toUpperCase()}
              </span>
            </button>
            <File fileData={e} isSelected={e.isSelected} />
            <div className="flex flex-nowrap ml-2 my-auto">
              <button onClick={() => removeFile(i)} className="">
                <IconX />
              </button>
              <button onClick={() => downloadCSV(i)} className="">
                <IconCsv />
              </button>
            </div>
          </div>
        </div>
      )
    })
  }

  return (
    <>
      <div className="flex w-full text-acc justify-center items-center @2xs/sidebar:hidden">
        <IconFiles className="w-8 h-8">

        </IconFiles>
      </div>
      <div className="p-2 border-b border-ptx flex-col @2xs/sidebar:flex hidden">
        <span className="text-center">
          Showing {pluralize(fileData.length, "file")}
        </span>
        <div className="text-sm flex flex-col space-y-1">
          {constructFileDrawer(fileData)}
        </div>
      </div>
    </>
  )
}


