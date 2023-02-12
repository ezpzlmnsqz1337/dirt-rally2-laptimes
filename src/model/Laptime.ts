export interface Laptime {
  uid: string
  carId: number
  driverId: string
  locationId: number
  stageId: number
  time: string
  timestamp: number
  notes: string
}

export interface LaptimeComponents {
  minutes: string
  seconds: string
  miliseconds: string
}
