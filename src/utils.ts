import { WeatherInfo } from './models';

export const formatDateTime = (date: Date): string => {
  const utcDate = new Date(date);
  // FUTURE: use timezone offset from API response
  const localTime = new Date(utcDate.getTime() - utcDate.getTimezoneOffset()); // adjust for local timezone offset
  return localTime.toLocaleString();
};

// IDEA: Open to toggle view between Fahrenheit and Celsius
export const kelvinToFahrenheit = (temp: number): number => {
  return parseFloat((((temp - 273.15) * 9) / 5 + 32).toFixed(1));
};

export const downloadWeatherInfo = (weatherInfo: WeatherInfo[]) => {
  const headers = [
    'Weather At',
    'Your Local Time',
    'City',
    'Country',
    'Lattitude',
    'Longitude',
    'Temperature (°F)',
    'Main Weather',
    'Description',
  ];
  const data = weatherInfo.map((item: WeatherInfo) => [
    formatDateTime(item.timestamp),
    item.name,
    item.country,
    item.lat,
    item.lon,
    kelvinToFahrenheit(item.temperature),
    item.main_weather,
    item.description,
  ]);

  const csvContent = [
    headers.join(','),
    ...data.map(row => row.join(',')),
  ].join('\n');

  const currentDate = new Date();
  const formattedDate = currentDate.toISOString().slice(0, 10);
  downloadFile(csvContent, `weather_info_${formattedDate}.csv`);
};

// FUTURE: fine for now, but for large files, we can could process on the server side instead and stream in some way
const downloadFile = (content: string, filename: string) => {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
