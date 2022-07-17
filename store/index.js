import { cars } from '@/assets/db/cars'

export const state = () => ({
  cars,
  locations: [],
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
  addStage (state, stage) {
    if (!stage) { return }

    const parts = stage.name.split(' / ').map(x => x.toLowerCase())
    const found = state.locations.find(x => parts.includes(x.name.toLowerCase()))
    if (!found) {
      console.log(parts)
      state.stages.push(stage)
    } else {
      console.log('Found stage !', parts)
      found.coordinates = stage.coordinates
    }
  },
  addLocation (state, location) {
    if (!location || !location.name) { return }
    const found = state.locations.find(x => location.name.toLowerCase().includes(x.name.toLowerCase()))
    if (!found) {
      state.locations.push(location)
    } else {
      found.coordinates = location.coordinates
    }
  },
  setActiveLocation (state, location) {
    state.activeStage = false
    state.activeLocation = location
  },
  setActiveStage (state, stage) {
    state.activeLocation = false
    state.activeStage = stage
  }
}
