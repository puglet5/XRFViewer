import { createId } from "@paralleldrive/cuid2"
import Uppy, { UppyFile } from "@uppy/core"
import { FileInput } from "@uppy/react"
import { memo, useEffect } from "react"
import {
  FileProps,
  ValidFileType,
  ValidFileTypes,
  XRFData,
  isValidFileType
} from "../common/interfaces"
import { constructXRFData, convertData } from "../utils/converters"

type Props = {
  data: XRFData[]
  setData: React.Dispatch<React.SetStateAction<XRFData[]>>
}

const uppy = new Uppy({
  autoProceed: false,
  allowMultipleUploads: true,
  allowMultipleUploadBatches: true,
  restrictions: {
    allowedFileTypes: Object.values(ValidFileTypes)
  }
})

function Uploader({ data, setData }: Props) {
  useEffect(() => {
    const handler = (files: UppyFile[]) => {
      files.map((e) => {
        const reader = new FileReader()
        reader.readAsText(e.data)
        reader.onload = () => {
          const rawData = reader.result
          const fileType = `.${e.name.split(".").at(-1) ?? ""}`
          if (typeof rawData === "string" && isValidFileType(fileType)) {
            const parsedData = convertData(rawData, fileType)

            if (parsedData) {
              const fileData: FileProps = {
                name: e.name.split(".")[0],
                size: e.size,
                type: fileType as ValidFileType
              }

              const data: XRFData = {
                id: createId(),
                data: { original: parsedData },
                plotData: [constructXRFData(parsedData, e.name.split(".")[0])],
                file: fileData,
                isModified: false,
                isDisplayed: true,
                isSelected: false,
                isBeingModified: false
              }

              setData((prevData) => [...prevData, data])
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
  }, [data, setData])
  return <FileInput uppy={uppy} />
}

export default memo(Uploader)
