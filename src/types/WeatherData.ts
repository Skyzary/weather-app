export interface CityCoords {
  lat: number;
  lon: number;
  name: string;
}
export interface CurrentWeatherData {
  name: string;
  main: {
    temp: number;
    humidity: number;
    feels_like?: number;
    pressure?: number;
  };
  weather: {
    description: string;
    icon?: string;
  }[];
  wind?: {
    speed: number;
    deg?: number;
  };
}

