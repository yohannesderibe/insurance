// utils/citiesData.ts

export interface City {
  name: string;
  sub_cities: string[];
}

export interface CitiesData {
  cities: City[];
}

// Import your JSON data
import citiesJson from './cities.json';

const citiesData: CitiesData = citiesJson;

// Get all cities
export const getAllCities = (): string[] => {
  return citiesData.cities.map(city => city.name);
};

// Get subcities for a specific city
export const getSubCities = (cityName: string): string[] => {
  const city = citiesData.cities.find(city => city.name === cityName);
  return city ? city.sub_cities : [];
};

// Get all cities with their subcities
export const getAllCitiesWithSubCities = (): City[] => {
  return citiesData.cities;
};