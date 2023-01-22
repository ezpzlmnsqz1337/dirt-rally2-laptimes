<template>
  <div class="__wrapper">
    <div
      v-for="s in stages"
      :key="`stage-${s.id}`"
      class="__item stage"
      :class="{__active: isActiveStage(s)}"
      @click="setActiveStage(s)"
    >
      <div>
        <div>{{ s.name }}</div> <div>{{ s.lengthKm }}km</div>
      </div>
      <div v-if="getTimesForStage(s).length > 0">
        {{ getTimesForStage(s).length }} time(s)
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapGetters } from 'vuex'

export default {
  name: 'StageList',
  props: {
    stages: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    ...mapState(['activeStage']),
    ...mapGetters(['getTimesForStage'])
  },
  methods: {
    ...mapMutations(['setActiveStage']),
    isActiveStage (stage) {
      if (!stage || !this.activeStage) { return false }
      return stage.id === this.activeStage.id
    }
  }
}
</script>

<style scoped lang="scss">
.__stage {
  text-align: center;
  padding: 0 0.5rem;
}

.__heading {
  text-align: center;
  margin-bottom: 1rem;
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
</style>
