import { XRFData } from "@/common/interfaces"
import { Menu } from "@headlessui/react"
import {
  IconCaretDown,
  IconCaretUp,
  IconCsv,
  IconDeselect,
  IconSelectAll,
  IconX
} from "@tabler/icons-react"
import { memo, useContext, useMemo } from "react"
import File from "./File"
import { DataContext } from "@/App"

function FileDrawer() {
  const { data, setData } = useContext(DataContext)

  const anySelected = useMemo(
    () => data.map((e) => e.isSelected).some((e) => e === true),
    [data]
  )

  const unmodifiedData = useMemo(
    () => data.filter((e) => e.isBeingModified === false),
    [data]
  )

  function removeFile(id: string) {
    const toRemove = data.findIndex((o) => o.id === id)
    if (toRemove > -1) {
      data.splice(toRemove, 1)
      setData([...data])
    }
  }

  function toggleFileSelection(id: string) {
    const toSelect = data.find((o) => o.id === id)
    if (toSelect) {
      toSelect.isSelected = !toSelect.isSelected
    }
    setData([...data])
  }

  function downloadCSV(id: string) {
    const toConvert = data.find((o) => o.id === id)
    if (toConvert) {
      const csvData = toConvert.data.original.x
        .map((e, i) => {
          return [e, toConvert.data.original.y[i]].join(",")
        })
        .join("\n")
      const blob = new Blob([csvData], { type: "text/csv" })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.setAttribute("href", url)
      a.setAttribute("download", `${toConvert.file.name.split(".")[0]}.csv`)
      a.click()
    }
  }

  function toggleSelectAll() {
    const selectedFiles = unmodifiedData.filter((e) => e.isSelected === true)
    if (!selectedFiles.length) {
      data.map((e) => {
        e.isSelected = true
      })
      setData([...data])
    } else {
      data.map((e) => {
        e.isSelected = false
      })
      setData([...data])
    }
  }

  function setTraceColor(trace: XRFData, color: string) {
    trace.traceColor = color
    trace.plotData.main.line!.color = color
    setData([...data])
  }

  const constructFileDrawer = useMemo(() => {
    return unmodifiedData.map((e) => {
      return (
        <div key={e.id}>
          <div className="flex h-full w-full select-none flex-nowrap">
            <button
              onClick={() => toggleFileSelection(e.id)}
              className="my-auto font-medium"
            >
              <span
                className={`${
                  e.isSelected ? " !bg-neutral-300" : ""
                } mr-2 aspect-square rounded-sm border border-black p-1`}
              >
                {e.file.type.replace(".", "").toUpperCase()}
              </span>
            </button>
            <File data={e} />
            <div className="my-auto ml-2 flex flex-nowrap text-acc">
              <button
                onClick={() => removeFile(e.id)}
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
                      onClick={() => downloadCSV(e.id)}
                      title="Download .csv"
                    >
                      <IconCsv className="my-auto" />
                    </button>
                  </Menu.Item>
                </Menu.Items>
              </Menu>
              <input
                id="nativeColorPicker1"
                type="color"
                title={"Set trace color"}
                value={e.traceColor ?? "#000000"}
                className={"w-6"}
                onChange={(event) => {
                  setTraceColor(e, event.target.value)
                }}
              />
            </div>
          </div>
        </div>
      )
    })
  }, [data])

  return (
    <div>
      {data.length ? (
        <div>
          <div className=" mx-3 hidden space-x-1 border-b border-ptx/20 text-acc @2xs/sidebar:flex">
            <button
              onClick={() => toggleSelectAll()}
              title={anySelected ? "Deselect all" : "Select all"}
            >
              {anySelected ? <IconDeselect /> : <IconSelectAll />}
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
