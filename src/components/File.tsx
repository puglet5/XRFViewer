import { FileProps } from "../utils/interfaces"

interface Props {
  fileData: FileProps
  isSelected: boolean
}

export default function File({ fileData, isSelected }: Props) {
  return (
    <span className="flex space-x-2 my-auto whitespace-nowrap overflow-hidden flex-grow">
      <span className="overflow-hidden text-ellipsis" title={fileData.name}>
        {fileData.name}
      </span>
      {fileData.size ?
        <>
          <span className="text-gray-500">
            &#8212;
          </span>
          <span className="italic text-gray-500 pr-0.5">
            {Number(fileData.size / 1000).toFixed(1)} kB
          </span>
        </> : null
      }
    </span>
  )
}

