import { useEffect } from "react"
import Uppy from "@uppy/core"
import { convertDat } from "../utils/converters"
import { FileProps } from "../utils/interfaces"
import { DragDrop } from "@uppy/react"
import { constructXRFData } from "../utils/converters"
import { ScatterData } from "plotly.js"
import { UppyFile } from "@uppy/core"
import { findPeaks } from "@/utils/processing"

interface Props {
  updateXRFData: React.Dispatch<React.SetStateAction<Partial<ScatterData>[]>>
  updateFileData: React.Dispatch<React.SetStateAction<FileProps[]>>
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

export default function Uploader({
  updateXRFData,
  updateFileData,
  fileData
}: Props) {
  useEffect(() => {
    const handler = (files: UppyFile[]) => {
      const newFileData: FileProps[] = files.map((e) => {
        return {
          id: e.id,
          name: e.name.split(".")[0],
          size: e.size,
          type: e.name.split(".")[1],
          isDisplayed: true,
          isSelected: false,
          isModified: false
        }
      })

      updateFileData([...fileData, ...newFileData])

      files.map((e) => {
        const reader = new FileReader()
        reader.readAsText(e.data)
        reader.onload = () => {
          if (reader.result) {
            const XRFData = convertDat(reader.result as string)
            updateXRFData((prevData) => [
              ...prevData,
              constructXRFData(XRFData, e.name.split(".")[0])
            ])
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
  return <DragDrop uppy={uppy} />
}
