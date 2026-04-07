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

export interface ForecastItem {
  dt: number;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  dt_txt: string;
  wind: {
      speed: number;
      deg: number;
      gust: number;
  }
}

export interface ForecastData {
  list: ForecastItem[];
  city: {
    name: string;
    coord: {
      lat: number;
      lon: number;
    };
    country: string;
  };
}
