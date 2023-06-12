import { IconReload } from "@tabler/icons-react"
import { ScatterData } from "plotly.js"
import { memo } from "react"
import { XRFData } from "../common/interfaces"
import Uploader from "./Uploader"

type Props = {
  updateSelectedElements: React.Dispatch<React.SetStateAction<number[]>>
  selectedElements: number[]
  periodicTableVisibility: boolean
  updatePlotData: React.Dispatch<React.SetStateAction<Partial<ScatterData>[]>>
  updatePeriodicTableVisibility: React.Dispatch<React.SetStateAction<boolean>>
  data: XRFData[]
  setData: React.Dispatch<React.SetStateAction<XRFData[]>>
}

function Controls({
  updateSelectedElements,
  selectedElements,
  data,
  setData
}: Props) {
  function resetPlotData() {
    localStorage.clear()
    updateSelectedElements([])
    setData([])
  }

  return (
    <div className="flex w-full items-center justify-center space-x-2">
      <button
        onClick={resetPlotData}
        title="Reset all"
        disabled={!data.length && !selectedElements.length}
        className="text-acc disabled:text-sfg"
      >
        <IconReload className="h-6 w-6" />
      </button>
      <div
        id="uploader"
        title={"Upload files"}
        className="hidden h-full items-center justify-center @2xs/sidebar:flex"
      >
        <Uploader data={data} setData={setData} />
      </div>
    </div>
  )
}

export default memo(Controls)
