import { useEffect } from "react"
import Uppy from "@uppy/core"
import { convertData, validateData } from "../utils/converters"
import { FileProps } from "../utils/interfaces"
import { DragDrop } from "@uppy/react"
import { constructXRFData } from "../utils/converters"
import { ScatterData } from "plotly.js"
import { UppyFile } from "@uppy/core"
import { createId } from "@paralleldrive/cuid2"

interface Props {
  updateXRFData: React.Dispatch<React.SetStateAction<Partial<ScatterData>[]>>
  updateFileData: React.Dispatch<React.SetStateAction<FileProps[]>>
  fileData: FileProps[]
}

const validFileTypes = [".dat"]

const uppy = new Uppy({
  autoProceed: false,
  allowMultipleUploads: true,
  allowMultipleUploadBatches: true,
  restrictions: {
    allowedFileTypes: validFileTypes
  }
})

export default function Uploader({ updateXRFData, updateFileData }: Props) {
  useEffect(() => {
    const handler = (files: UppyFile[]) => {
      files.map((e) => {
        const reader = new FileReader()
        reader.readAsText(e.data)
        reader.onload = () => {
          let rawData = reader.result
          let fileType = `.${e.name.split(".").at(-1) ?? ""}`
          if (
            typeof rawData === "string" &&
            validFileTypes.includes(fileType) &&
            validateData(rawData, fileType)
          ) {
            let newFileData = {
              id: createId(),
              name: e.name.split(".")[0],
              size: e.size,
              type: fileType,
              isDisplayed: true,
              isSelected: false,
              isModified: false
            }

            const XRFData = convertData(rawData)
            updateXRFData((prevData) => [
              ...prevData,
              constructXRFData(XRFData, e.name.split(".")[0])
            ])
            updateFileData((prevData) => [...prevData, newFileData])
          }
        }
      })
    }
    uppy.on("files-added", handler)
    return () => {
      uppy.off("files-added", handler)
      uppy.cancelAll()
    }
  }, [updateXRFData])
  return <DragDrop uppy={uppy} />
}
