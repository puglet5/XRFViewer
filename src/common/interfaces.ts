export interface FileProps {
  readonly id: string
  name: string
  size?: number
  type: string
  isDisplayed: boolean
  isSelected: boolean
  isModified: boolean
  modifications?: Modification
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

export interface PeakData {
  set: Peak[][]
  modified: Peak[][]
}

export enum ValidFileTypes {
  CSV = ".csv",
  DAT = ".dat"
}

export type ValidFileType = `${ValidFileTypes}`
export const isValidFileType = <ValidFileType>(
  fileType: any
): fileType is ValidFileType => true
