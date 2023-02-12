import type { Car } from './Car'
import type { Driver } from './Driver'
import type { Stage } from './Stage'
import type { Location } from './Location'

export interface LaptimeWithData {
  uid: string
  car?: Car
  driver?: Driver
  location?: Location
  stage?: Stage
  time: string
  timestamp: number
  notes: string
}
