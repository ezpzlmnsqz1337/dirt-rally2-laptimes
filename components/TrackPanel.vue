<template>
  <div class="__trackPanel">
    <h2>Locations</h2>
    <div
      v-for="(l, index) in locations"
      :key="`location-${index}`"
      class="__item __location"
      :class="{__active: isActiveLocation(l)}"
      @click="setActiveLocation(l)"
    >
      {{ l.name }}
    </div>
    <h2>Stages</h2>
    <div v-for="(s, index) in stages" :key="`stage-${index}`" class="__item __stage" :class="{__active: isActiveStage(s)}" @click="setActiveStage(s)">
      {{ s.name }}
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'TrackPanel',
  computed: {
    ...mapState(['locations', 'stages', 'activeLocation', 'activeStage'])
  },
  methods: {
    ...mapMutations(['setActiveStage', 'setActiveLocation']),
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

<style scoped>
.__trackPanel {
  background-color: rgba(31, 31, 31, 0.7);
  width: 30vw;
  height: 95vh;
  overflow: scroll;
  padding: 1rem;
  margin: 1.5rem 0 1.5rem 1.5rem;
  color: white;
}

h2 {
  margin-bottom: 1rem;
}

.__item {
  background-color: rgba(31, 31, 31, 0.7);
  padding: 0.7rem;
  margin-bottom: 0.8rem;
  font-size: 1.5rem;
}

.__item.__active {
  background-color: #0045E0;
}

.__item:hover {
  cursor: pointer;
  background-color: rgba(184, 184, 184, 0.7);
}

</style>
