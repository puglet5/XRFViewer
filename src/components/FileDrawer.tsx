import { FileProps } from "../utils/interfaces"
import { IconFile } from "@tabler/icons-react"
import File from "./File"

interface Props {
  fileData: FileProps[]
}

export default function FileDrawer({ fileData }: Props) {

  const constructFileDrawer = (data: FileProps[]) => {
    return data.map((e) => {
      return (
        <div className="text-sm flex space-x-2" key={e.id}>
          <IconFile className="w-4 h-4 my-auto" />
          <File fileData={e} />
        </div>
      )
    })
  }

  console.log(constructFileDrawer(fileData))

  return (
    <div className="p-2 border-b border-ptx flex flex-col">
      <span className="text-center">
        Showing {fileData.length} files
      </span>
      <div>
        {constructFileDrawer(fileData)}
      </div>
    </div>
  )
}


