<template>
  <div class="__trackPanel">
    <h2 class="__heading">
      {{ activeLocation ? 'Stages' : 'Locations' }}
    </h2>
    <div v-if="!activeLocation" class="__locations">
      <div
        v-for="(l, index) in locations"
        :key="`location-${index}`"
        class="__item __location"
        :class="{__active: isActiveLocation(l)}"
        @click="setActiveLocation(l)"
      >
        <div>{{ l.name }}</div> <div><span :class="`fp fp-lg ${l.countryCode}`" /></div>
      </div>
    </div>
    <div v-if="activeLocation" class="__stages">
      <div class="__back">
        <button @click="setActiveLocation(null)">
          &lt; Back
        </button>
        <div>{{ activeLocation.name }}</div>
        <div><span :class="`fp fp-lg ${activeLocation.countryCode}`" /></div>
      </div>
      <div
        v-for="(s, index) in activeLocation.forward"
        :key="`stage-${index}`"
        class="__item stage"
        :class="{__active: isActiveStage(l)}"
        @click="setActiveStage(l)"
      >
        <div>{{ s.name }}</div> <div>{{ s.lengthKm }}km</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'TrackPanel',
  computed: {
    ...mapState(['locations', 'stages', 'activeLocation', 'activeStage', 'stagesShow', 'locationsShow'])
  },
  methods: {
    ...mapMutations(['setActiveStage', 'setActiveLocation', 'showStages', 'showLocations']),
    isActiveLocation (location) {
      if (!location || !this.activeLocation) { return false }
      return location.name === this.activeLocation.name
    },
    isActiveStage (stage) {
      if (!stage || !this.activeStage) { return false }
      return stage.name === this.activeStage.name
    }
  }
}
</script>

<style scoped lang="scss">
.__trackPanel {
  background-color: rgba(31, 31, 31, 0.7);
  width: 30vw;
  height: 95vh;
  padding: 1rem;
  margin: 1.5rem 0 1.5rem 1.5rem;
  color: white;
  display: flex;
  flex-direction: column;
}

.__locations {
  overflow: scroll;
}

.__heading {
  text-align: center;
  margin-bottom: 1rem;
}

.__btn {
  display: inline-block;
  font-size: 1rem;
  color: white;
  background-color: #a4a4a5;
  padding: 0.5rem 1rem;
  border-radius: 0.3rem;

  &:hover {
    background-color: #0045e0;
    cursor: pointer;
  }

  &.__active {
    background-color: #0045e0;
  }
}

h2 {
  margin-bottom: 1rem;
}

.__item {
  padding: 0.8rem 1rem;
  margin-bottom: 0.5rem;
  font-size: 1rem;
  border-radius: 0.3rem;
  background-color: #777777;

  &:hover {
    cursor: pointer;
    background-color: #0045e0;
  }

  &.__active {
    background-color: #0045E0;
  }
}

.__location {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.__back {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;

  button {
    padding: 0.8rem 1rem;
    font-size: 1rem;
    border-radius: 0.3rem;
    background-color: #777777;

    &:hover {
      cursor: pointer;
      background-color: #0045e0;
    }

    &.__active {
      background-color: #0045E0;
    }
  }
}

</style>
