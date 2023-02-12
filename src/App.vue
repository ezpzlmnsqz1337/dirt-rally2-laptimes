<script setup lang="ts">
import MapView from './components/MapView.vue'
import TrackPanel from './components/TrackPanel.vue'
import ContentPanel from './components/ContentPanel.vue'
import { useDataStore } from './stores/data';
import { storeToRefs } from 'pinia';
import { onBeforeUnmount, onMounted } from 'vue';

// store
const store = useDataStore()

const {
  leftPanelShow,
  rightPanelShow,
} = storeToRefs(store)

onMounted(() => {
  store.subscribeDb()
})

onBeforeUnmount(() => {
  store.unsubscribeAll()
})
</script>

<template>
  <div class="__wrapper">
    <div class="__background">
      <MapView />
    </div>
    <div class="__left" :class="{ __hidden: !leftPanelShow }">
      <TrackPanel />
    </div>
    <div class="__right" :class="{ __hidden: !rightPanelShow }">
      <ContentPanel />
    </div>
  </div>
</template>

<style lang="scss">
.__wrapper,
.__background {
  font-family: 'Inter', sans-serif;
  color: white;
  width: 100%;
  height: 100%;
}

.__background {
  position: absolute;
}

.__left {
  position: absolute;
  transition: left 0.3s;
  left: 0;
  height: 100%;
  z-index: 1;

  &.__hidden {
    left: -100vw;
  }
}

.__right {
  position: absolute;
  transition: right 0.3s;
  right: 0;
  height: 100%;
  z-index: 1;

  &.__hidden {
    right: -100vw;
  }
}
</style>
