import { FileProps } from "../common/interfaces"
import {
  IconCsv,
  IconX,
  IconSelectAll,
  IconDeselect,
  IconCaretDown,
  IconCaretUp
} from "@tabler/icons-react"
import File from "./File"
import { ScatterData } from "plotly.js"
import { memo, useEffect, useMemo } from "react"
import { createId } from "@paralleldrive/cuid2"
import { Menu } from "@headlessui/react"

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
  updateModifiedData: React.Dispatch<
    React.SetStateAction<Partial<ScatterData>[]>
  >
}

function FileDrawer({
  fileData,
  updateFileData,
  updateXRFData,
  currentXRFData,
  updateSelectedFiles,
  selectedFiles,
  updateModifiedData
}: Props) {
  useEffect(() => {
    const selectedFileIndices = fileData.flatMap((e, i) => {
      return e.isSelected ? i : []
    })
    updateSelectedFiles([...selectedFileIndices])
  }, [fileData])

  function removeFile(fileIndex: number) {
    const newFileData = [...fileData]
    newFileData.splice(fileIndex, 1)
    const newXRFData = [...currentXRFData]
    newXRFData.splice(fileIndex, 1)
    localStorage.setItem("fileData", JSON.stringify(newFileData))
    localStorage.setItem("currentXRFData", JSON.stringify(newXRFData))
    updateFileData(newFileData)
    updateXRFData(newXRFData)

    if (!newFileData.length) {
      updateModifiedData([])
    }
  }

  function toggleFileSelection(fileIndex: number) {
    const newFileData = [...fileData]
    newFileData[fileIndex].isSelected = !newFileData[fileIndex].isSelected
    localStorage.setItem("fileData", JSON.stringify(newFileData))
    updateFileData(newFileData)
    updateSelectedFiles(newFileData.flatMap((e, i) => (e.isSelected ? i : [])))
  }

  function downloadCSV(fileIndex: number) {
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

  function toggleSelectAll() {
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

  const constructFileDrawer = useMemo(() => {
    return fileData.map((e, i) => {
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
            <File fileData={e} />
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
  }, [fileData, selectedFiles])

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
              {constructFileDrawer}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default memo(FileDrawer)
