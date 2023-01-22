<template>
  <div class="__contentPanel">
    <div class="__close" @click="close()">
      Close
    </div>
    <div v-if="activeLocation" class="__locationContent">
      <h2>{{ activeLocation.name }}</h2>
    </div>
    <div v-if="activeStage" class="__stageContent">
      <h3>{{ activeStage.name }}</h3>
      <div class="__table">
        <CarGroupFilter class="__carGroupFilter" />
        <TimeTable :times="getTimesForStage(activeStage)" :group="carGroupFilter" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapGetters } from 'vuex'

export default {
  name: 'ContentPanel',
  computed: {
    ...mapState(['activeStage', 'activeLocation', 'carGroupFilter']),
    ...mapGetters(['getTimesForStage'])
  },
  methods: {
    ...mapMutations(['showRightPanel', 'setActiveStage', 'setCarGroupFilter']),
    close () {
      this.setActiveStage(null)
    }
  }
}
</script>

<style scoped lang="scss">
.__contentPanel {
  background-color: rgba(31, 31, 31, 0.7);
  padding: 1rem 1rem;
  width: 63vw;
  height: 95vh;
  margin: 1.5rem;
  position: relative;

  .__table {
    margin-top: 1rem;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: flex-end;
  }

  .__close {
    border-radius: 0.3rem;
    position: absolute;
    right: 1rem;
    top: 1rem;
    padding: 0.5rem 1rem;
    color: white;
    background-color: #e91f1f;
    font-size: 1rem;

    &:hover {
      cursor: pointer;
      background-color: #d40909;
    }
  }
}

</style>
