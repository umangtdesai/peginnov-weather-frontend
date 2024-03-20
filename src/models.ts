export interface City {
  id: number;
  name: string;
  country: string;
  lat: number;
  lon: number;
}

export interface CityId {
  id: number;
}

export interface WeatherInfo extends City {
  timestamp: Date;
  temperature: number;
  description: string;
  raw_api_response: JSON | string; // camel case --> snake case at service layer; not code cleaning right now
  icon_code: string;
  main_weather: string;
}
