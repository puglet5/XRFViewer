import { memo } from "react"
import { FileProps } from "../common/interfaces"

interface Props {
  fileData: FileProps
  isSelected: boolean
}

function File({ fileData, isSelected }: Props) {
  return (
    <span className="my-auto flex flex-grow space-x-2 overflow-hidden whitespace-nowrap">
      <span className="overflow-hidden text-ellipsis" title={fileData.name}>
        {fileData.name}
      </span>
      {fileData.size ? (
        <>
          <span className="text-gray-500">&#8212;</span>
          <span className="pr-0.5 italic text-gray-500">
            {(+fileData.size / 1000).toFixed(1)} kB
          </span>
        </>
      ) : null}
    </span>
  )
}

export default memo(File)
