import { memo } from "react"
import { XRFData } from "../common/interfaces"

type Props = {
  data: XRFData
}

function File({ data }: Props) {
  return (
    <span className="my-auto flex flex-grow space-x-2 overflow-hidden whitespace-nowrap">
      <span className="overflow-hidden text-ellipsis" title={data.file.name}>
        {data.file.name}
      </span>
      {data.file.size ? (
        <>
          <span className="text-gray-500">&#8212;</span>
          <span className="pr-0.5 italic text-gray-500">
            {(+data.file.size / 1000).toFixed(1)} kB
          </span>
        </>
      ) : null}
    </span>
  )
}

export default memo(File)
