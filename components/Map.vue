<template>
  <div class="__main">
    <gmap-map
      ref="mapRef"
      :center="center"
      :zoom="2.5"
      :options="{disableDefaultUI: true, minZoom: 2.5}"
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
      center: { lat: 30, lng: 35 },
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
    ...mapState(['stages', 'locations', 'activeLocation', 'activeStage'])
  },
  watch: {
    activeLocation (newLocation, _oldLocation) {
      if (newLocation) {
        this.map.panTo({ ...newLocation.coordinates, zoom: 12 })
        setTimeout(() => {
          this.map.setZoom(ZOOM_LEVEL_SELECTED)
        }, 1000)
      } else {
        this.map.panTo({ ...this.center, zoom: 2.5 })
      }
    },
    activeStage (_newStage, _oldStage) {
      this.showRightPanel(true)
    }
  },
  async mounted () {
    this.map = await this.$refs.mapRef.$mapPromise
  },
  methods: {
    ...mapMutations(['showRightPanel', 'addStage', 'setActiveStage', 'setActiveLocation', 'setMap']),
    addLocations (...locations) {
      locations.forEach(({ name, countryCode, coordinates }) => {
        const [lng, lat] = coordinates
        this.addLocation({ name, countryCode, coordinates: { lat, lng } })
      })
    },
    markerClick (location) {
      this.setActiveLocation(location)
    },
    stageClick (stage) {
      this.setActiveStage(stage)
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
