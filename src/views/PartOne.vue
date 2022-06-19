<template>
  <div class="home">
    <VehicleWithMaxPilotsWorldPopulationSum />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import VehicleWithMaxPilotsWorldPopulationSum from '@/components/VehicleWithMaxPilotsWorldPopulationSum.vue';

export default defineComponent({
  name: 'PartOne',
  components: {
    VehicleWithMaxPilotsWorldPopulationSum,
  },
});
</script>
