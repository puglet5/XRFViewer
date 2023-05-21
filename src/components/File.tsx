import { FileProps } from "../utils/interfaces"

interface Props {
  fileData: FileProps
}

export default function File({ fileData }: Props) {
  return (
    <>
      <span className="my-auto lg:col-span-9 whitespace-nowrap overflow-hidden text-ellipsis col-span-9">
        {fileData.name}, {Number(fileData.size / 1000).toFixed(1)}kB
      </span>
    </>
  )
}

