/* eslint-disable @typescript-eslint/no-non-null-assertion */

import swapi, { PilotData, PlanetData } from '@/services/swapi';
import Pilot from '@/types/Pilot';
import Planet from '@/types/Planet';
import Vehicle from '@/types/Vehicle';
import Utils from '@/utils';
import { Commit, createStore } from 'vuex';

interface PlanetChartItem extends Planet {
  barHeight: number;
}

const loadRelatedData = async ({ commit, state }: { commit: Commit, state: AppState }, pilotUrl: string) => {
  if (!state.pilotsMap.has(pilotUrl)) {
    const pilot = await swapi.getPilot(Utils.getId(pilotUrl));
    commit('savePilot', pilot);
    if (!state.planetsMap.has(pilot.homeworld)) {
      const planet = await swapi.getPlanet(Utils.getId(pilot.homeworld));
      commit('savePlanet', planet);
    }
  }
}

const mapPilot = ({ state }: { state: AppState }, pilotUrl: string): Pilot => {
  const pilot = state.pilotsMap.get(pilotUrl)!;
  const planet = state.planetsMap.get(pilot.homeworld)!;
  return {
    url: pilot.url,
    name: pilot.name,
    planet: {
      url: planet.url,
      name: planet.name,
      population: Number(planet.population)
    }
  };
};

const calculateBarHeight = ({population, maxBarSize, barStep}: {population: number, maxBarSize: number, barStep: number}): number => {
  const barPixels = Math.round(population / barStep);
  if (barPixels > maxBarSize) {
      return maxBarSize;
  }
  return barPixels;
};

export interface AppState {
  pilotsMap: Map<string, PilotData>,
  planetsMap: Map<string, PlanetData>,
  planetsByName: { [name: string]: PlanetData },
  loading: boolean
  vehicle?: Vehicle,
  maxPopulation: number,
  planetsChart?: Array<PlanetChartItem>
}

export default createStore({
  state: (): AppState => ({
    pilotsMap: new Map<string, PilotData>(),
    planetsMap: new Map<string, PlanetData>(),
    planetsByName: {},
    loading: false,
    maxPopulation: 0
  }),
  getters: {
    pilotsMap (state): Map<string, PilotData> {
      return state.pilotsMap;
    },
    planetsMap (state): Map<string, PlanetData> {
      return state.planetsMap;
    },
    loading (state): boolean {
      return state.loading;
    },
    vehicle (state): Vehicle | undefined {
      return state.vehicle;
    },
    planetsChart (state): Array<PlanetChartItem> | undefined {
      return state.planetsChart;
    }
  },
  mutations: {
    savePilot (state, pilot: PilotData) {
      state.pilotsMap.set(pilot.url, pilot);
    },
    savePlanet (state, planet: PlanetData) {
      state.planetsMap.set(planet.url, planet);
      state.planetsByName[planet.name] = planet;
    },
    saveVehicle (state, vehicle: Vehicle) {
      state.vehicle = vehicle;
    },
    showLoader (state) {
      state.loading = true;
    },
    hideLoader (state) {
      state.loading = false;
    },
    setVehicle (state, vehicle) {
      state.vehicle = vehicle;
    },
    setMaxPopulation (state, maxPopulation) {
      state.maxPopulation = maxPopulation;
    },
    addPlanetToChart(state, planetChartItem: PlanetChartItem) {
      if (!state.planetsChart) {
        state.planetsChart = [];
      }
      state.planetsChart.push(planetChartItem);
    },
    clearPlanetsChart(state) {
      state.planetsChart = undefined;
    }
  },
  actions: {
    async findVehicleWithMaxPopulationSum({ commit, state }: { commit: Commit, state: AppState }) {
      let maxPopulation = 0 as number;
      let nextPageNumber = 1 as number;
      let hasNextPage = true as boolean;

      commit('showLoader');
      try {
        while (hasNextPage) {
          const {results: vehicles, next} = await swapi.getVehicles(nextPageNumber);
          for (let i = 0; i < vehicles.length; i++) {
            const {url, name, pilots} = vehicles[i];
            let vehicleHomeWorldsPopulation = 0;
            for (let j = 0; j < pilots.length; j++) {
              const pilotUrl = pilots[j];
              await loadRelatedData({ commit, state }, pilotUrl);
              const planetUrl = state.pilotsMap.get(pilotUrl)!.homeworld;
              const population = Number(state.planetsMap.get(planetUrl)!.population);
              if (!isNaN(population)) {
                vehicleHomeWorldsPopulation += population;
              }
            }
            if (vehicleHomeWorldsPopulation > maxPopulation) {
              maxPopulation = vehicleHomeWorldsPopulation;
              commit('setVehicle', {
                url,
                name,
                maxPilotPopulationSum: maxPopulation,
                pilots: pilots.map((pilotUrl: string) => mapPilot({ state }, pilotUrl))
              });
            }
          }
          hasNextPage = next != null;
          if (hasNextPage) {
            nextPageNumber = Utils.getPageNumber(next);
          }
        }
      } finally {
        commit('hideLoader');
      }
    },
    async findPlanetsByName({ commit, state }: { commit: Commit, state: AppState }, {planetNames, maxBarSize, barStep}: {planetNames: Array<string>, maxBarSize: number, minBarSize: number, barStep: number}) {
      let nextPageNumber = 1 as number;
      let hasNextPage = true as boolean;
      commit('clearPlanetsChart');
      commit("showLoader");
      try {
        while (hasNextPage) {
          const { results: planets, next } = await swapi.getPlanets(nextPageNumber);
          for (let i = 0; i < planets.length; i++) {
            const planet = planets[i];
            if (planetNames.includes(planet.name)) {
                commit("savePlanet", planet);
            }
          }
          hasNextPage = next != null;
          if (hasNextPage) {
            nextPageNumber = Utils.getPageNumber(next);
          }
        }
      } finally {
        commit("hideLoader");
      }
      commit('setMaxPopulation', Math.max(...planetNames.map(planetName => Number(state.planetsByName[planetName].population))));
      planetNames.forEach(planetName => {
        const {url, name, population: populationStr} = state.planetsByName[planetName];
        const population = Number(populationStr);
        commit('addPlanetToChart', {
          url,
          name,
          population,
          barHeight: calculateBarHeight({population, maxBarSize, barStep})
        });
      });
    }

  },
  modules: {
  }
})
