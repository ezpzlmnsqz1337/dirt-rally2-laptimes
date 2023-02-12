<script setup lang="ts">
import type { Coordinates } from '@/model/Coordinates';
import type { Location } from '@/model/Location';
import type { Stage } from '@/model/Stage';
import { GoogleMap, Marker, Polyline } from 'vue3-google-map';

import { marker64x64 } from '@/assets/map/icons/base64/rally-marker-64x64';
import { markerSelected64x64 } from '@/assets/map/icons/base64/rally-marker-selected-64x64';
import { useDataStore } from '@/stores/data';
import { storeToRefs } from 'pinia';
import { ref, watch } from 'vue';
import { key as gmapKey } from '@/gmap-key';

// store
const store = useDataStore()

const {
  stages,
  locations,
  activeLocation,
  activeStage,
} = storeToRefs(store)

const {
  setActiveLocation,
  setActiveStage,
  showRightPanel,
} = store

// data
const mapRef = ref<typeof GoogleMap | null>(null);
const infoWinOpen = ref(false);
const infoOptions = ref({});
const hoverStage = ref<Stage | null>(null);
const circleOptions = ref({});
const center = ref<Coordinates>({ lat: 30, lng: 35 });
const pins = {
  selected: `data:image/png;base64,${markerSelected64x64}`,
  notSelected: `data:image/png;base64,${marker64x64}`
};
const mapStyle = [];
const clusterStyle = [
  {
    url: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m1.png',
    width: 56,
    height: 56,
    textColor: '#fff'
  }
];
let zooming: any | null = null;
let panning: any | null = null;

const ZOOM_LEVEL_FAR = 3
const ZOOM_LEVEL_SELECTED = 14

watch(activeLocation, newLocation => {
  if (newLocation) {
    zoomToLocation(newLocation as Location)
  } else {
    zoomOut()
    showRightPanel(false)
  }
})

watch(activeStage, newStage => showRightPanel(Boolean(newStage)))

watch(() => mapRef.value?.ready, () => {
  // do map things if needed
})

// methods
const markerClick = (location: Location) => {
  setActiveLocation(location)
}

const stageClick = (stage: Stage) => {
  setActiveStage(stage)
}

const stageMouseover = (stage: Stage | null) => {
  if (!stage) { return }
  hoverStage.value = stage
}

const stageMouseout = () => {
  hoverStage.value = null
}

const getStagePolylineColor = (stage: Stage) => {
  if (activeStage.value && activeStage.value === stage) {
    return '#0045E0'
  }
  if (hoverStage.value && hoverStage.value === stage) {
    return '#57a8de'
  }
  return '#a6d5f5'
}

const zoomToLocation = (location: Location) => {
  if (!mapRef.value?.map) { return }
  if (panning !== null) {
    clearTimeout(panning)
  }
  mapRef.value.map.panTo({ ...location.coordinates })
  fluentZoom(ZOOM_LEVEL_SELECTED)
}

const zoomOut = () => {
  if (!mapRef.value?.map) { return }
  if (panning !== null) {
    clearTimeout(panning)
  }
  fluentZoom(ZOOM_LEVEL_FAR)
  panning = setTimeout(() => mapRef.value?.map.panTo({ ...center.value }), 5000)
}

const fluentZoom = (zoom: number, speed = 300) => {
  if (!mapRef.value?.map) { return }
  if (zooming !== null) {
    clearTimeout(zooming)
  }
  const currentZoom = mapRef.value.map.getZoom()
  if (zoom === currentZoom) {
    return
  }
  const newZoom = currentZoom < zoom ? currentZoom + 1 : currentZoom - 1
  mapRef.value.map.setZoom(newZoom)
  zooming = setTimeout(() => fluentZoom(zoom, speed), speed)
}
</script>

<template>
  <div class="__main">
    <GoogleMap :api-key="gmapKey" ref="mapRef" :center="center" :zoom="ZOOM_LEVEL_FAR"
    :disableDefaultUi="true" :minZoom="ZOOM_LEVEL_FAR" map-type-id="satellite" class="__map">
      <Marker v-for="(l, index) in locations" :key="index" :options="{
        position: l.coordinates,
        icon: activeLocation === l ? pins.selected : pins.notSelected,
        animation: 2,
        clickable: true
      }" @click="markerClick(l as Location)" />
      <Polyline v-for="(s, index) in stages" :key="`stage-${index}`" ref="stagesRef" :options="{
        strokeColor: getStagePolylineColor(s),
        clickable: true,
        strokeWeight: 10,
        path: s.coordinates || []
      }" @mouseover="stageMouseover(s)" @mouseout="stageMouseout()" @click="stageClick(s)" />
    </GoogleMap>
  </div>
</template>

<style scoped>
.__map {
  width: 100vw;
  height: 100vh;
}
</style>
