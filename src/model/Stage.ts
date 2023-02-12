import type { Coordinates } from "./Coordinates"

export interface Stage {
  id: number
  name: string
  lengthKm: string
  coordinates?: Coordinates
}
