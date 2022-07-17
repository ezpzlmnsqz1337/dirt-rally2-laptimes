<template>
  <div class="__wrapper">
    <div class="__background">
      <Map />
    </div>
    <div class="__left" :class="{ __hidden: !leftPanelShow }">
      <TrackPanel />
    </div>
    <div class="__right" :class="{ __hidden: !rightPanelShow }">
      <ContentPanel />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'IndexPage',
  computed: {
    ...mapState(['rightPanelShow', 'leftPanelShow'])
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600&display=swap');
::-webkit-scrollbar{
  width: 0;
}

.__wrapper, .__background {
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
}

.__left.__hidden {
  left: -100vw;
}

.__right {
  position: absolute;
  transition: right 0.3s;
  right: 0;
  height: 100%;
  z-index: 1;
}

.__right.__hidden {
  right: -100vw;
}
</style>
