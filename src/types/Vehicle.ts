import Pilot from "./Pilot";
import Planet from "./Planet";

export default interface Vehicle {
  url: string;
  name: string;
  pilots: Array<Pilot>;
  maxPilotPopulationSum: number;
}