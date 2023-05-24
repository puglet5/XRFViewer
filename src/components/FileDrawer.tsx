import { FileProps } from "../utils/interfaces"
import { IconCsv, IconX, IconFiles } from "@tabler/icons-react"
import File from "./File"
import { ScatterData } from "plotly.js"
import { useState } from "react"
import { createId } from "@paralleldrive/cuid2"

interface Props {
  updateXRFData: React.Dispatch<React.SetStateAction<Partial<ScatterData>[]>>,
  currentXRFData: Partial<ScatterData>[],
  updateFileData: React.Dispatch<React.SetStateAction<FileProps[]>>,
  fileData: FileProps[]
}

export default function FileDrawer({ fileData, updateFileData, updateXRFData, currentXRFData }: Props) {
  const [selectedFiles, setSelectedFiles] = useState<number[]>([])
  const removeFile = (fileIndex: number) => {
    const newFileData = fileData.filter((_e, i) => i !== fileIndex)
    const newXRFData = currentXRFData.filter((_e, i) => i !== fileIndex)
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

  const constructFileDrawer = (data: FileProps[]) => {
    return data.map((e, i) => {
      return (
        <div key={createId()}>
          <div className="flex w-full h-full flex-nowrap">
            <button
              onClick={() => toggleFileSelection(i)}
              className="font-medium my-auto"
            >
              {/* <IconFile className="w-4 h-4 my-auto col-span-1 mx-auto" /> */}
              <span className={`${e.isSelected ? " !bg-neutral-300" : ""} p-1 border border-black aspect-square rounded-sm mr-2`}>
                {e.type.toUpperCase()}
              </span>
            </button>
            <File fileData={e} isSelected={e.isSelected} />
            <div className="flex flex-nowrap ml-2 my-auto">
              <button onClick={() => removeFile(i)} className="" title="Remove file">
                <IconX className="text-acc" />
              </button>
              <button onClick={() => downloadCSV(i)} className="" title="Download .csv">
                <IconCsv className="text-acc" />
              </button>
            </div>
          </div>
        </div>
      )
    })
  }

  return (
    <div>
      <div className="flex w-full text-acc justify-center items-center @2xs/sidebar:hidden">
        <IconFiles className="w-8 h-8" />
      </div>
      <div className="p-2 flex-col @2xs/sidebar:flex hidden">
        <div className="text-sm flex flex-col space-y-1.5">
          {constructFileDrawer(fileData)}
        </div>
      </div>
    </div>
  )
}


