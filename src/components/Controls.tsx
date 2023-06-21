import { IconReload } from "@tabler/icons-react"
import { memo, useContext } from "react"
import Uploader from "./Uploader"
import { DataContext } from "@/App"

type Props = {
  updateSelectedElements: React.Dispatch<React.SetStateAction<number[]>>
  selectedElements: number[]
}

function Controls({ updateSelectedElements, selectedElements }: Props) {
  const { data, setData } = useContext(DataContext)

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
        <Uploader />
      </div>
    </div>
  )
}

export default memo(Controls)
