<template>
  <div class="__trackPanel">
    <h2 class="__heading">
      {{ activeLocation ? 'Stages' : 'Locations' }}
    </h2>
    <div v-if="!activeLocation" class="__locations">
      <LocationList :locations="locations" />
    </div>
    <div v-if="activeLocation" class="__stages">
      <div class="__back">
        <button @click="back()">
          &lt; Back
        </button>
        <div class="__stage">
          {{ activeLocation.name }}
        </div>
        <div><span :class="`fp fp-lg ${activeLocation.countryCode}`" /></div>
      </div>

      <div class="__heading">
        Forward
      </div>
      <StageList :stages="activeLocation.forward" />

      <div class="__heading">
        Reverse
      </div>
      <StageList :stages="activeLocation.reverse" />
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'TrackPanel',
  computed: {
    ...mapState(['locations', 'activeLocation'])
  },
  methods: {
    ...mapMutations(['setActiveLocation']),
    back () {
      this.setActiveLocation(null)
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

.__locations, .__stages {
  overflow: scroll;
}

.__stage {
  text-align: center;
  padding: 0 0.5rem;
}

.__heading {
  text-align: center;
  margin-bottom: 1rem;
}

.__back {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;

  button {
    padding: 0.8rem 1rem;
    font-size: 1rem;
    white-space: nowrap;
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
