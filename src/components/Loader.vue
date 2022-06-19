// Loader.vue
<template>
  <div class="overlay">
    <img v-if="loading" src="../assets/loading.gif" width="200" alt="">
  </div>
</template>

<script lang="ts">
  import { mapGetters } from "vuex";

  export default {
    name: "LoaderComponent",
    computed: {
      ...mapGetters(['loading'])
    }
  }
</script>

<style scoped lang="scss">

.overlay {
  z-index: 9;
}
</style>

