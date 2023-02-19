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
  <div class="__app">
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
.__app {
  font-family: 'Inter', sans-serif;
    color: white;
    width: 100%;
    height: 100%;

  .__background {
    font-family: 'Inter', sans-serif;
    color: white;
    width: 100%;
    height: 100%;
    position: absolute;
  }

  .__left {
    position: absolute;
    transition: left 0.3s;
    left: 0;
    height: 100%;
    z-index: 1;
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

  .__btn {
    border: 0;
    padding: 0.5rem 1rem;
    border-radius: 0.3rem;
    font-size: 1rem;
    color: white;
    background-color: #777777;

    &:disabled {
      color: #d3d3d3;
      background-color: #999999 !important;

      &:hover {
        cursor: not-allowed;
      }
    }

    &:hover {
      cursor: pointer;
      background-color: #0045e0;
    }

    &.__success {
      background-color: #2da701;

      &:hover {
        background-color: #006402;
      }
    }

    &.__danger {
      background-color: #e91f1f;

      &:hover {
        background-color: #d40909;
      }
    }
  }

  .__select {
    color: black;
  }
}

@media screen and (max-width: 768px) {
  .__app {
    .__left {
      width: 100%;
      margin: 0;

      &.__hidden {
        left: -100vw;
      }
    }

    .__right {
      width: 100%;
      margin: 0;
    }
  }
}
</style>
