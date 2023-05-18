import { useEffect } from "react"
import Uppy from '@uppy/core'
import convertDat from "../utils/converters"
import { FileProps } from "../utils/interfaces"
import { DragDrop } from "@uppy/react"
import type { ChartData } from 'chart.js'

interface Props {
  updateXRFData: React.Dispatch<React.SetStateAction<ChartData<'scatter'>>>,
  updateFileData: React.Dispatch<React.SetStateAction<FileProps[]>>,
  fileData: FileProps[]
}

const uppy = new Uppy({
  autoProceed: false,
  allowMultipleUploads: true,
  allowMultipleUploadBatches: true,
  restrictions: {
    allowedFileTypes: [".dat"]
  }
})

export default function Uploader({ updateXRFData, updateFileData, fileData }: Props) {

  useEffect(() => {
    const handler = (files: any[]) => {
      let newFileData: FileProps[] = files.map((e) => {
        return {
          id: e.id,
          name: e.name,
          size: e.size,
          isDisplayed: true
        }
      })

      updateFileData([...fileData, ...newFileData])

      files.map((e) => {
        const reader = new FileReader
        reader.readAsText(e.data)
        reader.onload = () => {
          if (reader.result) {
            updateXRFData((prevData: ChartData<'scatter'>) => ({
              datasets: [
                ...prevData.datasets,
                {
                  label: e.name.split(".")[0],
                  data: convertDat(reader.result as string)!
                }
              ]
            }))
          }
        }
      })
    }
    uppy.on("files-added", handler)
    return () => {
      uppy.off("files-added", handler)
      uppy.cancelAll()
    }
  }, [updateXRFData, fileData])
  return (
    <DragDrop uppy={uppy} />
  )
}

