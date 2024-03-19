import { WeatherInfo, City, CityId } from './models';

// Notes:
// 1. Clients for similar resources should be grouped together / different files
// 2. Currently, I just return [] for all different types of errors. In a real application, I would want to handle these differently
// 3. All of these methods follow a very similar pattern. We could abstract away the fetch and error handling

// const BASE_WEATHER_PROVIDER_URL = process.env.BASE_WEATHER_PROVIDER_URL;
const BASE_WEATHER_PROVIDER_URL = 'http://127.0.0.1:8000';

// all of these methods follow a very similar pattern. We could abstract away the fetch and error handling
export const createWeatherData = async (
  cityIds: number[],
  timestamp?: Date
): Promise<WeatherInfo[]> => {
  try {
    const params = new URLSearchParams();
    if (timestamp) {
      params.append('timestamp', timestamp.toISOString());
    }
    cityIds.forEach(id => params.append('city_ids', id.toString()));

    const response = await fetch(
      `${BASE_WEATHER_PROVIDER_URL}/weather?${params}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to create weather data');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching weather data:', error);
  }

  return [];
};

export const fetchWeatherData = async (): Promise<WeatherInfo[]> => {
  try {
    const response = await fetch(`${BASE_WEATHER_PROVIDER_URL}/weather`);
    if (!response.ok) {
      throw new Error('Failed to fetch weather info');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching weather info:', error);
    return [];
  }
};

export const searchCity = async (city: string): Promise<City[]> => {
  const url = new URL(`${BASE_WEATHER_PROVIDER_URL}/cities/search`);
  url.searchParams.append('city', city);

  try {
    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error('Failed to fetch city search results');
    }

    return await response.json();
  } catch (error) {
    console.error('Error city search results:', error);
    return [];
  }
};

export const createCity = async (city: City): Promise<CityId> => {
  try {
    const response = await fetch(`${BASE_WEATHER_PROVIDER_URL}/cities`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(city),
    });

    if (!response.ok) {
      throw new Error('Failed to create city');
    }

    return await response.json();
  } catch (error) {
    console.error('Error when creating a city:', error);
    throw error;
  }
};
