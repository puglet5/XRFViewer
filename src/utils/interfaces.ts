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
  scaleFactor?: number
  smoothingRadius?: number
}

export interface Peak {
  position: number
  positionIndex: number
  intensity: number
  relativeIntensity?: number
  fwhm?: number
  assignment?: string
}
