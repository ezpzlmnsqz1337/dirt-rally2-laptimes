<template>
  <div class="__main">
    <gmap-map
      ref="mapRef"
      :center="{ lat: 30, lng: 35 }"
      :zoom="2.5"
      map-type-id="satellite"
      class="__map"
    >
      <gmap-marker
        v-for="(l, index) in locations"
        :key="index"
        :position="l.coordinates"
        :icon="activeLocation === l ? pins.selected : pins.notSelected"
        :animation="2"
        :clickable="true"
        @click="markerClick(l)"
      />

      <gmap-polyline
        v-for="(s, index) in stages"
        :key="`stage-${index}`"
        ref="stagesRef"
        :clickable="true"
        :path="s.coordinates"
        :options="{strokeColor: getStagePolylineColor(s)}"
        :stroke-weight="10"
        @mouseover="stageMouseover(s)"
        @mouseout="stageMouseout()"
        @click="stageClick(s)"
      />
    </gmap-map>
  </div>
</template>

<script>
import { getGoogleMapsAPI } from 'gmap-vue'
import { mapMutations, mapState } from 'vuex'
import { marker64x64 } from '~/assets/map/icons/base64/rally-marker-64x64'
import { markerSelected64x64 } from '~/assets/map/icons/base64/rally-marker-selected-64x64'

const ZOOM_LEVEL_SELECTED = 14

export default {
  name: 'IndexPage',
  data () {
    return {
      map: null,
      infoWinOpen: false,
      infoOptions: {},
      hoverStage: null,
      circleOptions: {},
      pins: {
        selected: `data:image/png;base64,${markerSelected64x64}`,
        notSelected: `data:image/png;base64,${marker64x64}`
      },
      mapStyle: [],
      clusterStyle: [
        {
          url: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m1.png',
          width: 56,
          height: 56,
          textColor: '#fff'
        }
      ]
    }
  },
  computed: {
    google: getGoogleMapsAPI,
    activeStageCoordinates () {
      if (!this.activeStage) { return { lat: 0, lng: 0 } }
      const coords = this.activeStage.coordinates
      return coords[Math.round(coords.length / 2)]
    },
    ...mapState(['stages', 'locations', 'activeLocation', 'activeStage'])
  },
  mounted () {
    const rally = require('@/assets/map/data/geojson/rally.geojson')
    const rallycross = require('@/assets/map/data/geojson/rallycross.geojson')
    const rallyStages = require('@/assets/map/data/geojson/rally-stages.geojson')

    this.addFeatures(...rally.features, ...rallyStages.features)
  },
  methods: {
    ...mapMutations(['showRightPanel', 'addLocation', 'addStage', 'setActiveStage', 'setActiveLocation']),
    addFeatures (...features) {
      features.forEach(({ geometry, properties }) => {
        if (geometry.type === 'Point') {
          const [lng, lat] = geometry.coordinates
          this.addLocation({ name: properties.Name, description: properties.description, coordinates: { lat, lng } })
        } else if (geometry.type === 'LineString') {
          const coordinates = geometry.coordinates.map(([lng, lat]) => ({ lat, lng }))
          this.addStage({ name: properties.Name, description: properties.description, coordinates })
        }
      })
    },
    markerClick (location) {
      this.setActiveStage(null)
      this.setActiveLocation(location)
      this.$refs.mapRef.$mapPromise.then((map) => {
        window.myMap = map
        map.panTo({ ...location.coordinates, zoom: 12 })
        setTimeout(() => {
          map.setZoom(ZOOM_LEVEL_SELECTED)
          this.showRightPanel(true)
        }, 1000)
      })
    },
    stageClick (stage) {
      this.setActiveLocation(null)
      this.setActiveStage(stage)
      this.$refs.mapRef.$mapPromise.then((map) => {
        map.panTo({ ...this.activeStageCoordinates, zoom: 12 })
        setTimeout(() => map.setZoom(ZOOM_LEVEL_SELECTED), 1000)
      })
    },
    stageMouseover (stage) {
      this.hoverStage = stage
    },
    stageMouseout () {
      this.hoverStage = null
    },
    getStagePolylineColor (stage) {
      if (this.activeStage && this.activeStage === stage) {
        return '#0045E0'
      }
      if (this.hoverStage && this.hoverStage === stage) {
        return '#57a8de'
      }
      return '#a6d5f5'
    }
  }
}
</script>

<style scoped>
.__map {
  width: 100vw;
  height: 100vh;
}
</style>
