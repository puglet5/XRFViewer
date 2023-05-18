import { FileProps } from "../utils/interfaces"

interface Props {
  fileData: FileProps
}

export default function File({ fileData }: Props) {
  return (
    <>
      <span className="my-auto">
        {fileData.name}, {Number(fileData.size / 1000).toFixed(1)}kB
      </span>
    </>
  )
}

