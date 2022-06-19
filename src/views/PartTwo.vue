<template>
  <div class="home">
    <PlanetsPopulationChart />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import PlanetsPopulationChart from '@/components/PlanetsPopulationChart.vue';

export default defineComponent({
  name: 'PartTwo',
  components: {
    PlanetsPopulationChart
  },
});
</script>