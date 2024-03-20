import { WeatherInfo, City, CityId } from './models';

// Notes:
// 1. Clients for similar resources should be grouped together / different files
// 2. Currently, I just return [] for all different types of errors. In a real application, I would want to handle these differently
// 3. All of these methods follow a very similar pattern. We could abstract away the fetch and error handling

// const BASE_WEATHER_PROVIDER_URL = process.env.BASE_WEATHER_PROVIDER_URL;
const BASE_WEATHER_PROVIDER_URL = 'http://127.0.0.1:8000';

// FUTURE: enum historic vs current
export const fetchWeatherData = async (type: string): Promise<WeatherInfo[]> => {
  try {
    const response = await fetch(`${BASE_WEATHER_PROVIDER_URL}/weather/${type}`);
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

export const getCities = async (): Promise<City[]> => {

  try {
    const response = await fetch(`${BASE_WEATHER_PROVIDER_URL}/cities`);
    if (!response.ok) {
      throw new Error('Failed to fetch cities');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching cities:', error);
    throw [];
  }
}

export const deleteCity = async (cityId: number): Promise<void> => {
  try {
    const response = await fetch(`${BASE_WEATHER_PROVIDER_URL}/cities/${cityId}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`Failed to delete city with ID ${cityId}`);
    }
  } catch (error) {
    console.error('Error deleting city:', error);
    throw error;
  }
}

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
