import { FileProps } from "../utils/interfaces"
import { IconCsv, IconX, IconFiles, IconSelectAll, IconDeselect, IconResize } from "@tabler/icons-react"
import File from "./File"
import { ScatterData } from "plotly.js"
import { useEffect } from "react"
import { createId } from "@paralleldrive/cuid2"

interface Props {
  updateXRFData: React.Dispatch<React.SetStateAction<Partial<ScatterData>[]>>
  currentXRFData: Partial<ScatterData>[]
  updateFileData: React.Dispatch<React.SetStateAction<FileProps[]>>
  updateModificationModalVisibility: React.Dispatch<React.SetStateAction<boolean>>
  modificationModalVisibility: boolean
  fileData: FileProps[]
  selectedFiles: number[]
  updateSelectedFiles: React.Dispatch<React.SetStateAction<number[]>>
}

export default function FileDrawer({ fileData, updateFileData, updateXRFData, currentXRFData, updateModificationModalVisibility, modificationModalVisibility, updateSelectedFiles, selectedFiles }: Props) {

  useEffect(() => {
    const selectedFileIndices = fileData.flatMap((e, i) => { return e.isSelected ? i : [] })
    updateSelectedFiles([...selectedFileIndices])
  }, [fileData])

  useEffect(() => {
    if (!selectedFiles.length) {
      updateModificationModalVisibility(false)
    }
  }, [selectedFiles])

  const removeFile = (fileIndex: number) => {
    const newFileData = fileData.filter((_e, i) => i !== fileIndex)
    const newXRFData = currentXRFData.filter((_e, i) => i !== fileIndex)
    localStorage.setItem("fileData", JSON.stringify(newFileData))
    localStorage.setItem("currentXRFData", JSON.stringify(newXRFData))
    updateFileData(newFileData)
    updateXRFData(newXRFData)
  }

  const toggleFileSelection = (fileIndex: number) => {
    const newFileData = [...fileData]
    newFileData[fileIndex].isSelected = !newFileData[fileIndex].isSelected
    localStorage.setItem("fileData", JSON.stringify(newFileData))
    updateFileData(newFileData)
    updateSelectedFiles(newFileData.flatMap((e, i) => e.isSelected ? i : []))
  }

  const downloadCSV = (fileIndex: number) => {
    const data = currentXRFData[fileIndex]
    if (data.x && data.y) {
      const csvData = (data.x as number[]).map((e, i) => { return [e, (data.x as number[])[i]].join(",") }).join('\n')
      const blob = new Blob([csvData], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.setAttribute('href', url)
      a.setAttribute('download', `${fileData[fileIndex].name.split(".")[0]}.csv`)
      a.click()
    }
  }

  const toggleSelectAll = () => {
    if (selectedFiles.length) {
      const newFileData = fileData.map(e => { return { ...e, isSelected: false } })
      updateFileData([...newFileData])
    } else {
      const newFileData = fileData.map(e => { return { ...e, isSelected: true } })
      updateFileData([...newFileData])
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
            <div className="flex flex-nowrap ml-2 my-auto text-acc">
              <button onClick={() => removeFile(i)} className="" title="Remove file">
                <IconX />
              </button>
              <button onClick={() => downloadCSV(i)} className="" title="Download .csv">
                <IconCsv />
              </button>
            </div>
          </div>
        </div>
      )
    })
  }

  return (
    <div>
      {fileData.length ?
        <div>
          <div className=" text-acc @2xs/sidebar:flex hidden space-x-1 border-b border-ptx/20 mx-3">
            <button onClick={() => toggleSelectAll()} title={selectedFiles.length ? "Deselect all" : "Select all"}>
              {
                selectedFiles.length ? <IconDeselect /> : <IconSelectAll />
              }
            </button>
            <button
              title={selectedFiles.length ? "Toggle modification modal" : ""}
              className={selectedFiles.length ? "" : "text-gray-300"}
              disabled={selectedFiles.length ? false : true}
              onClick={() => updateModificationModalVisibility(!modificationModalVisibility)}
            >
              <IconResize />
            </button>
          </div>
          <div className="p-2 flex-col @2xs/sidebar:flex hidden">
            <div className="text-sm flex flex-col space-y-1.5">
              {constructFileDrawer(fileData)}
            </div>
          </div>
        </div>
        : null
      }
    </div>
  )
}


