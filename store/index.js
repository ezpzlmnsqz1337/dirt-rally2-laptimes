import { cars } from '@/assets/db/cars'
import { locations } from '@/assets/db/locations'

export const state = () => ({
  cars,
  locations: locations.rally,
  stages: [],
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
