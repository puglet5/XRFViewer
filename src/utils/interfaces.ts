export interface Point {
  x: number
  y: number
}

export interface FileProps {
  readonly id: string
  name: string
  size?: number
  type: string
  isDisplayed: boolean
  isSelected: boolean
  isModified: boolean
  modifications?: {
    scaleFactor?: number
  }
}

export interface Modification {
  scaleFactor?: number
}
