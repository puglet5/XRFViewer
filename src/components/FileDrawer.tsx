import { FileProps } from "../utils/interfaces"
import { IconCsv, IconFile, IconX } from "@tabler/icons-react"
import File from "./File"
import { Datum, ScatterData } from "plotly.js"

interface Props {
  updateXRFData: React.Dispatch<React.SetStateAction<Partial<ScatterData>[]>>,
  currentXRFData: Partial<ScatterData>[],
  updateFileData: React.Dispatch<React.SetStateAction<FileProps[]>>,
  fileData: FileProps[]
}

export default function FileDrawer({ fileData, updateFileData, updateXRFData, currentXRFData }: Props) {
  const removeFile = (index: number) => {
    const newFileData = fileData.filter((_e, i) => i != index)
    const newXRFData = currentXRFData.filter((_e, i) => i != index)
    localStorage.setItem("fileData", JSON.stringify(newFileData))
    localStorage.setItem("currentXRFData", JSON.stringify(newXRFData))
    updateFileData(newFileData)
    updateXRFData(newXRFData)
  }

  const downloadCSV = (fileIndex: number) => {
    const data = currentXRFData[fileIndex]
    if (data.x && data.y)
    {
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
            <IconFile className="w-4 h-4 my-auto col-span-1 mx-auto lg:block hidden" />
            <File fileData={e} />
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


