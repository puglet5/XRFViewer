import { ScatterData } from "plotly.js"

export interface FileProps {
  name: string
  size?: number
  type: ValidFileType | ".mod"
  metadata?: object
}

export interface ParsedData {
  x: number[]
  y: number[]
}

export interface Modification {
  scalingFactor?: number
  smoothingRadius?: number
  baselineCorrection?: boolean
  peakDetection?: boolean
}

export interface Peak {
  position: number
  positionIndex: number
  intensity: number
  relativeIntensity?: number
  fwhm?: number
  assignment?: string
}

export enum ValidFileTypes {
  CSV = ".csv",
  DAT = ".dat",
  TXT = ".txt"
}

export type ValidFileType = `${ValidFileTypes}`
export const isValidFileType = <ValidFileType>(
  fileType: any
): fileType is ValidFileType => true

export interface XRFData {
  readonly id: string
  data: {
    original: ParsedData
    modified?: ParsedData
    peaks?: Peak[]
    deconvolved?: ParsedData[]
    deconvolvedComponents?: ParsedData[]
    selectedPoints: number[]
  }
  plotData: {
    main: Partial<ScatterData>
    deconvolutions?: Partial<ScatterData>[]
  }
  file: FileProps
  isModified: boolean
  isBeingModified: boolean
  isDisplayed: boolean
  isSelected: boolean
  modifications?: Modification
  traceColor?: string
}

export interface ElementData {
  data: EmissionLineData
}

interface EmissionLine {
  iupacSymbol: string
  siegbahnSymbol: string
  initialLlevel: string
  finalLlevel: string
  emissionEnergy: number
  intensity: number
}

export const elementSymbols = [
  "None",
  "H",
  "He",
  "Li",
  "Be",
  "B",
  "C",
  "N",
  "O",
  "F",
  "Ne",
  "Na",
  "Mg",
  "Al",
  "Si",
  "P",
  "S",
  "Cl",
  "Ar",
  "K",
  "Ca",
  "Sc",
  "Ti",
  "V",
  "Cr",
  "Mn",
  "Fe",
  "Co",
  "Ni",
  "Cu",
  "Zn",
  "Ga",
  "Ge",
  "As",
  "Se",
  "Br",
  "Kr",
  "Rb",
  "Sr",
  "Y",
  "Zr",
  "Nb",
  "Mo",
  "Tc",
  "Ru",
  "Rh",
  "Pd",
  "Ag",
  "Cd",
  "In",
  "Sn",
  "Sb",
  "Te",
  "I",
  "Xe",
  "Cs",
  "Ba",
  "La",
  "Ce",
  "Pr",
  "Nd",
  "Pm",
  "Sm",
  "Eu",
  "Gd",
  "Tb",
  "Dy",
  "Ho",
  "Er",
  "Tm",
  "Yb",
  "Lu",
  "Hf",
  "Ta",
  "W",
  "Re",
  "Os",
  "Ir",
  "Pt",
  "Au",
  "Hg",
  "Tl",
  "Pb",
  "Bi",
  "Po",
  "At",
  "Rn",
  "Fr",
  "Ra",
  "Ac",
  "Th",
  "Pa",
  "U",
  "Np",
  "Pu",
  "Am",
  "Cm",
  "Bk",
  "Cf"
] as const

export type ElementSymbol = (typeof elementSymbols)[number]

export type EmissionLineData = {
  [key in ElementSymbol]?: {
    emissionLines: EmissionLine[]
    atomicNumber: number
  }
}
