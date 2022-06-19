<template>
  <div class="centered bottom-space">
    <Loader />
    <table v-if="vehicle" id="vehicle-table" border="2px">
      <caption>Vehicle with the highest sum of its pilots’ home planets population</caption>
      <tbody>
        <tr>
          <td class="column-left">Vehicle name with the largest sum</td>
          <td class="column-right">{{ vehicle.name }}<br />{{ vehicle.maxPilotPopulationSum }}</td>
        </tr>
        <tr>
          <td class="column-left">Related home planets and their respective population</td>
          <td class="column-right">
            <ul>
              <li v-for="pilot in vehicle.pilots" v-bind:key="pilot.url">{{ pilot.planet.name }}, {{ pilot.planet.population }}</li>
            </ul>
          </td>
        </tr>
        <tr>
          <td class="column-left">Related pilot names</td>
          <td class="column-right">
            <ul>
              <li v-for="pilot in vehicle.pilots" v-bind:key="pilot.url">{{ pilot.name }}</li>
            </ul>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapGetters } from 'vuex';
import Loader from './Loader.vue';

export default defineComponent({
  name: 'vehicle-with-largest-sum',
  components: {
    Loader
  },
  computed: {
    ...mapGetters(['pilotsMap', 'planetsMap', 'vehicle'])
  },
  methods: {
  },
  created() {
    this.$store.dispatch('findVehicleWithMaxPopulationSum');
  }
});
</script>

<style scoped lang="scss">

#vehicle-table {
  caption {
    caption-side: top; 
    text-transform: uppercase;
    letter-spacing: .5px;
    position: relative; 
    font-weight: bold;
    margin-bottom: 32px;
    font-size: 14px;
  }
  position: relative; 
  width: 600px; 
  height: 300px;
  margin: 1.1em 0 0; 
  padding: 0;
  background: transparent;
}
h3 {
  margin: 40px 0 0;
}
.column-left {
  text-align: left;
  padding: 5px;
}
.column-right {
  width: 40%;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.centered {
  margin: 0 auto;
  width: 50%;
}
.bottom-space {
  margin-bottom: 50px;
}

</style>
