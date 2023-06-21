import { createContext } from "react"
import { XRFData } from "./interfaces"

type DataContextType = {
  data: XRFData[]
  setData: React.Dispatch<React.SetStateAction<XRFData[]>>
}

const IDataContext = {
  data: [],
  setData: () => {}
}

export const DataContext = createContext<DataContextType>(IDataContext)
