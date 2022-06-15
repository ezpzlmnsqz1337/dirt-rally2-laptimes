export const state = () => ({
  locations: [],
  stages: [],
  activeLocation: null,
  activeStage: null,
  rightPanelShow: false,
  leftPanelShow: true
})

export const mutations = {
  showRightPanel (state, show) {
    if (!show) { return }
    state.rightPanelShow = show
  },
  showLeftPanel (state, show) {
    if (!show) { return }
    state.leftPanelShow = show
  },
  addStage (state, stage) {
    if (!stage) { return }
    state.stages.push(stage)
  },
  addLocation (state, location) {
    if (!location) { return }
    state.locations.push(location)
  },
  setActiveLocation (state, location) {
    state.activeLocation = location
  },
  setActiveStage (state, stage) {
    state.activeStage = stage
  }
}
