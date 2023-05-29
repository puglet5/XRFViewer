import { FileProps } from "../common/interfaces"
import {
  IconCsv,
  IconX,
  IconSelectAll,
  IconDeselect,
  IconResize,
  IconCaretDown,
  IconCaretUp
} from "@tabler/icons-react"
import File from "./File"
import { ScatterData } from "plotly.js"
import { useEffect } from "react"
import { createId } from "@paralleldrive/cuid2"
import { Menu } from "@headlessui/react"
import Uploader from "./Uploader"

interface Props {
  updateXRFData: React.Dispatch<React.SetStateAction<Partial<ScatterData>[]>>
  currentXRFData: Partial<ScatterData>[]
  updateFileData: React.Dispatch<React.SetStateAction<FileProps[]>>
  updateModificationModalVisibility: React.Dispatch<
    React.SetStateAction<boolean>
  >
  modificationModalVisibility: boolean
  fileData: FileProps[]
  selectedFiles: number[]
  updateSelectedFiles: React.Dispatch<React.SetStateAction<number[]>>
}

export default function FileDrawer({
  fileData,
  updateFileData,
  updateXRFData,
  currentXRFData,
  updateModificationModalVisibility,
  modificationModalVisibility,
  updateSelectedFiles,
  selectedFiles
}: Props) {
  useEffect(() => {
    const selectedFileIndices = fileData.flatMap((e, i) => {
      return e.isSelected ? i : []
    })
    updateSelectedFiles([...selectedFileIndices])
  }, [fileData])

  useEffect(() => {
    if (!selectedFiles.length) {
      updateModificationModalVisibility(false)
    }
  }, [selectedFiles])

  const removeFile = (fileIndex: number) => {
    const newFileData = [...fileData]
    newFileData.splice(fileIndex, 1)
    const newXRFData = [...currentXRFData]
    newXRFData.splice(fileIndex, 1)
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
    updateSelectedFiles(newFileData.flatMap((e, i) => (e.isSelected ? i : [])))
  }

  const downloadCSV = (fileIndex: number) => {
    const data = currentXRFData[fileIndex]
    if (data.x && data.y) {
      const csvData = (data.x as number[])
        .map((e, i) => {
          return [e, (data.y as number[])[i]].join(",")
        })
        .join("\n")
      const blob = new Blob([csvData], { type: "text/csv" })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.setAttribute("href", url)
      a.setAttribute(
        "download",
        `${fileData[fileIndex].name.split(".")[0]}.csv`
      )
      a.click()
    }
  }

  const toggleSelectAll = () => {
    if (selectedFiles.length) {
      const newFileData = fileData.map((e) => {
        return { ...e, isSelected: false }
      })
      updateFileData([...newFileData])
    } else {
      const newFileData = fileData.map((e) => {
        return { ...e, isSelected: true }
      })
      updateFileData([...newFileData])
    }
  }

  const constructFileDrawer = (data: FileProps[]) => {
    return data.map((e, i) => {
      return (
        <div key={createId()}>
          <div className="flex h-full w-full select-none flex-nowrap">
            <button
              onClick={() => toggleFileSelection(i)}
              className="my-auto font-medium"
            >
              {/* <IconFile className="w-4 h-4 my-auto col-span-1 mx-auto" /> */}
              <span
                className={`${
                  e.isSelected ? " !bg-neutral-300" : ""
                } mr-2 aspect-square rounded-sm border border-black p-1`}
              >
                {e.type.replace(".", "").toUpperCase()}
              </span>
            </button>
            <File fileData={e} isSelected={e.isSelected} />
            <div className="my-auto ml-2 flex flex-nowrap text-acc">
              <button
                onClick={() => removeFile(i)}
                className=""
                title="Remove file"
              >
                <IconX />
              </button>
              <Menu>
                <Menu.Button as="div" className={"ui-open:rotate-180"}>
                  <IconCaretDown></IconCaretDown>
                  <IconCaretUp className={"hidden"}></IconCaretUp>
                </Menu.Button>
                <Menu.Items className="absolute right-0 mr-2 mt-6 flex w-32 items-center justify-center rounded-sm border border-ptx bg-white">
                  <Menu.Item>
                    <button
                      onClick={() => downloadCSV(i)}
                      title="Download .csv"
                    >
                      <IconCsv className="my-auto" />
                    </button>
                  </Menu.Item>
                </Menu.Items>
              </Menu>
            </div>
          </div>
        </div>
      )
    })
  }

  return (
    <div>
      {fileData.length ? (
        <div>
          <div className=" mx-3 hidden space-x-1 border-b border-ptx/20 text-acc @2xs/sidebar:flex">
            <button
              onClick={() => toggleSelectAll()}
              title={selectedFiles.length ? "Deselect all" : "Select all"}
            >
              {selectedFiles.length ? <IconDeselect /> : <IconSelectAll />}
            </button>
            <button
              title={selectedFiles.length ? "Toggle modification modal" : ""}
              className={selectedFiles.length ? "" : "text-gray-300"}
              disabled={selectedFiles.length ? false : true}
              onClick={() =>
                updateModificationModalVisibility(!modificationModalVisibility)
              }
            >
              <IconResize />
            </button>
            <Menu>
              <Menu.Button as="div" className={"ui-open:rotate-180"}>
                <IconCaretDown></IconCaretDown>
                <IconCaretUp className={"hidden"}></IconCaretUp>
              </Menu.Button>
              <Menu.Items className="right-100 absolute mr-2 mt-6 flex w-32 items-center justify-center rounded-sm border border-ptx bg-white">
                <Menu.Item>
                  <button title="Download .csv">
                    <IconCsv className="my-auto" />
                  </button>
                </Menu.Item>
              </Menu.Items>
            </Menu>
          </div>
          <div className="hidden flex-col p-2 @2xs/sidebar:flex">
            <div className="flex flex-col space-y-1.5 text-sm">
              {constructFileDrawer(fileData)}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
