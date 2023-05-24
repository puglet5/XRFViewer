import { FileProps } from "../utils/interfaces"

interface Props {
  fileData: FileProps
  isSelected: boolean
}

export default function File({ fileData, isSelected }: Props) {
  return (
    <span className={"my-auto lg:col-span-9 whitespace-nowrap overflow-hidden text-ellipsis col-span-9" + `${isSelected ? " !bg-pfg" : ""}`}>
      {fileData.name}, {Number(fileData.size / 1000).toFixed(1)}kB
    </span>
  )
}

