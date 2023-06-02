import { memo, useEffect } from "react"
import Uppy from "@uppy/core"
import { convertData } from "../utils/converters"
import {
  FileProps,
  isValidFileType,
  ValidFileType,
  ValidFileTypes
} from "../common/interfaces"
import { constructXRFData } from "../utils/converters"
import { ScatterData } from "plotly.js"
import { UppyFile } from "@uppy/core"
import { createId } from "@paralleldrive/cuid2"
import { FileInput } from "@uppy/react"

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
    allowedFileTypes: Object.values(ValidFileTypes)
  }
})

function Uploader({ updateXRFData, updateFileData, fileData }: Props) {
  useEffect(() => {
    const handler = (files: UppyFile[]) => {
      files.map((e) => {
        const reader = new FileReader()
        reader.readAsText(e.data)
        reader.onload = () => {
          const rawData = reader.result
          const fileType = `.${e.name.split(".").at(-1) ?? ""}`
          if (typeof rawData === "string" && isValidFileType(fileType)) {
            const newFileData = {
              id: createId(),
              name: e.name.split(".")[0],
              size: e.size,
              type: fileType,
              isDisplayed: true,
              isSelected: false,
              isModified: false
            }

            const XRFData = convertData(rawData, fileType)
            if (XRFData) {
              updateXRFData((prevData) => [
                ...prevData,
                constructXRFData(XRFData, e.name.split(".")[0])
              ])
              updateFileData((prevData) => [...prevData, newFileData])
            }
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
  return <FileInput uppy={uppy} />
}

export default memo(Uploader)
