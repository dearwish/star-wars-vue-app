import http from "../http";

export interface VehicleData {
  url: string;
  name: string;
  pilots: Array<string>;
}

export interface VehiclesResponse {
  next: string,
  previous: string,
  page: number,
  count: number,
  results: Array<VehicleData>
}

export interface PilotData {
  url: string;
  name: string;
  homeworld: string;  
}

export interface PlanetData {
  url: string;
  name: string;
  population: string;
}

export interface PlanetsResponse {
  next: string,
  previous: string,
  page: number,
  count: number,
  results: Array<PlanetData>
}

class StarWarsDataService {
  async getVehicles(page = 1): Promise<VehiclesResponse> {
    const response = await http.get(`/starships?page=${page}`);
    return response.data;
  }
  async getPilot(id: string): Promise<PilotData> {
    const response = await http.get(`/people/${id}`);
    return response.data;
  }
  async getPlanet(id: string): Promise<PlanetData> {
    const response = await http.get(`/planets/${id}`);
    return response.data;
  }
  async getPlanets(page = 1): Promise<PlanetsResponse> {
    const response = await http.get(`/planets?page=${page}`);
    return response.data;
  }
}

export default new StarWarsDataService();