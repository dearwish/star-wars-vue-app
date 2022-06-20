<template>
  <div class="centered bottom-space">
    <Loader />
    <table v-if="planetsChart && planetsChart.length > 0" id="chart">
      <caption>Home planets population chart</caption>
      <tbody>
        <template v-for="(planet, index) in planetsChart" v-bind:key="planet.url">
          <tr :class="`col-${index + 1}`">
            <th scope="row">{{ planet.name }}</th>
            <td class="bar" :style="`height: ${planet.barHeight + minBarSize}px;`">
              <p>{{ planet.population.toLocaleString() }}</p>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { defineComponent } from 'vue';
import { mapGetters } from 'vuex';
import Loader from './Loader.vue';

export default defineComponent({
    name: "home-planet-population-chart",
    data() {
      return {
        maxBarSize: 500 as number,
        minBarSize: 5 as number,
        barStep: 10000000 as number
      };
    },
    components: { Loader },
    computed: {
      ...mapGetters(["planetsChart"])
    },
    mounted() {
      if (!this.planetsChart) {
        this.$store.dispatch('findPlanetsByName', {
          planetNames: ["Tatooine", "Alderaan", "Naboo", "Bespin", "Endor"],
          maxBarSize: this.maxBarSize,
          barStep: this.barStep
        });
      }
    }
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

$bar-color: #39cccc;

#chart {
  position: relative; 
  width: 600px; 
  height: 500px;
  padding: 0;
  background: transparent;
  font-size: 11px;
}

#chart caption {
  caption-side: top; 
  width: 600px;
  text-transform: uppercase;
  letter-spacing: .5px;
  position: relative; 
  font-weight: bold;
  margin-bottom: 10px;
  font-size: 14px;
}

#chart tr, #chart th, #chart td { 
  position: absolute;
  bottom: 0; 
  width: 150px; 
  z-index: 2;
  margin: 0; 
  padding: 0;
  text-align: center;
}

#chart td {
  transition: all .3s ease;
  
  &:hover {
    background-color: desaturate(#85144b, 100);
    opacity: .6;
    color: rgb(27, 57, 139);
  }
}
  
#chart tbody tr {
  height: 300px;
  padding-top: 2px;
  color: #aaa;
}

$step: 120;
@for $i from 1 through 5 {
  #chart .col-#{$i} {
    $value: unquote((($i - 1) * $step) + 'px');
    left: ($value);
  }
}

#chart tbody th {
  bottom: -1.75em;
  vertical-align: top;
  font-weight: normal;
  color: #333;
}
#chart .bar {
  width: 70px; 
  border: 1px solid; 
  border-bottom: none; 
  color: #000;
  left: 42px; 
  background-color: $bar-color;
  border-color: transparent;
}
#chart .bar p {
  margin: -20px 0 0; 
  padding: 0;
  opacity: .8;
}
.centered {
  margin: 0 auto;
  width: 50%;
}

.bottom-space {
  margin-bottom: 50px;
}
</style>
