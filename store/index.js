import { cars } from '@/assets/db/cars'
import { drivers } from '@/assets/db/drivers'
import { times } from '@/assets/db/times'
import { locations } from '@/assets/db/locations'

export const state = () => ({
  cars,
  locations: locations.rally,
  stages: [],
  drivers,
  times,
  activeLocation: null,
  activeStage: null,
  rightPanelShow: false,
  leftPanelShow: true,
  locationsShow: true,
  stagesShow: false
})

export const mutations = {
  showRightPanel (state, show) {
    state.rightPanelShow = show
  },
  showLeftPanel (state, show) {
    state.leftPanelShow = show
  },
  showLocations (state, show) {
    state.stagesShow = false
    state.locationsShow = show
  },
  showStages (state, show) {
    state.locationsShow = false
    state.stagesShow = show
  },
  setActiveLocation (state, location) {
    state.activeLocation = location
    state.activeStage = null
  },
  setActiveStage (state, stage) {
    state.activeStage = stage
  }
}

export const getters = {
  getTimesForStage: state => (stage) => {
    return state.times
      .filter(x => x.stageId === stage.id)
      .map(({ carId, driverId, locationId, stageId, ...laptime }) => ({
        ...laptime,
        car: state.cars.find(x => x.id === carId),
        driver: state.drivers.find(x => x.id === driverId),
        location: state.locations.find(x => x.id === locationId),
        stage: state.stages.find(x => x.id === stageId)
      }))
      .sort((a, b) => a.laptime - b.laptime)
  }
}
