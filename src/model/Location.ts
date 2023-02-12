import type { Coordinates } from './Coordinates'
import type { Stage } from './Stage'

export interface Location {
  id: number
  name: string
  countryCode: string
  coordinates: Coordinates
  forward: Stage[]
  reverse: Stage[]
}
