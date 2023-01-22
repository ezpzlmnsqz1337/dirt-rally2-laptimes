<template>
  <div class="__wrapper">
    Group: <v-select
      class="__select"
      :options="getCarGroups()"
      :value="carGroupFilter"
      :searchable="false"
      :clearable="false"
      @input="setCarGroupFilter"
    />
  </div>
</template>

<script>
import { mapState, mapMutations, mapGetters } from 'vuex'

export default {
  name: 'CarGroupFilter',
  computed: {
    ...mapState(['carGroupFilter']),
    ...mapGetters(['getCarGroups'])
  },
  methods: {
    ...mapMutations(['setCarGroupFilter'])
  }
}
</script>

<style scoped lang="scss">
.__wrapper {
  display: flex;
  align-items: center;
  gap: 0.5rem;

  .__select {
    color: black;
    min-width: 15rem;
    display: inline-block;
  }
}
</style>
