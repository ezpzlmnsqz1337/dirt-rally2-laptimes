<template>
  <div class="__wrapper">
    <div
      v-for="l in locations"
      :key="`location-${l.id}`"
      class="__item __location"
      :class="{__active: isActiveLocation(l)}"
      @click="setActiveLocation(l)"
    >
      <div>{{ l.name }}</div> <div><span :class="`fp fp-lg ${l.countryCode}`" /></div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapGetters } from 'vuex'

export default {
  name: 'LocationList',
  props: {
    locations: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    ...mapState(['activeLocation']),
    ...mapGetters(['getTimesForStage'])
  },
  methods: {
    ...mapMutations(['setActiveLocation']),
    isActiveLocation (location) {
      if (!location || !this.activeLocation) { return false }
      return location.id === this.activeLocation.id
    }
  }
}
</script>

<style scoped lang="scss">
.__stage {
  text-align: center;
  padding: 0 0.5rem;
}

.__item {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
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
</style>
