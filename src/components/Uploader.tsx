import { useEffect } from "react"
import Uppy from '@uppy/core';
import convertDat from "../utils/converters";
import { FileProps } from "../utils/interfaces";
import { DragDrop } from "@uppy/react";
import type { ChartData } from 'chart.js';

interface Props {
  updatePlotData: React.Dispatch<React.SetStateAction<ChartData<'scatter'>>>,
  updateFileProps: React.Dispatch<React.SetStateAction<FileProps[]>>,
  fileProps: FileProps[]
}

const uppy = new Uppy({
  autoProceed: false,
  allowMultipleUploads: true,
  allowMultipleUploadBatches: true,
  restrictions: {
    allowedFileTypes: [".dat"]
  }
})

export default function Uploader({ updatePlotData, updateFileProps, fileProps }: Props) {
  useEffect(() => {
    const handler = (files: any[]) => {
      let newFileProps: FileProps[] = files.map((e) => {
        return {
          id: e.id,
          name: e.name,
          size: e.size,
          isDisplayed: true
        }
      })

      updateFileProps([...fileProps, ...newFileProps])

      files.map((e) => {
        const reader = new FileReader
        reader.readAsText(e.data)
        reader.onload = () => {
          if (reader.result) {
            updatePlotData((prevData: ChartData<'scatter'>) => ({
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
    }
  }, [updatePlotData, fileProps])
  return (
    <DragDrop uppy={uppy} />
  )
}

