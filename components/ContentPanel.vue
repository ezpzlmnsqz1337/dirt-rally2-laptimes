<template>
  <div class="__contentPanel">
    <div class="__close" @click="showRightPanel(false)">
      Close
    </div>
    <div v-if="activeStage" class="__stageContent">
      <h2>{{ activeStage.name }}</h2>
      <p>{{ activeStage.description }}</p>
    </div>
    <div v-if="activeLocation" class="__locationContent">
      <h2>{{ activeLocation.name }}</h2>
      <p>{{ activeLocation.description }}</p>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'ContentPanel',
  computed: {
    ...mapState(['activeStage', 'activeLocation'])
  },
  methods: {
    ...mapMutations(['showRightPanel'])
  }
}
</script>

<style scoped>
.__contentPanel {
  background-color: rgba(31, 31, 31, 0.7);
  padding: 1rem 1rem;
  width: 63vw;
  height: 95vh;
  margin: 1.5rem;
  position: relative;
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
}

.__close:hover {
  cursor: pointer;
  background-color: #d40909;
}

</style>
