/* ============================================================
   WORLD CONQUEST — Major World Cities Data
   ~80 cities with coordinates, country, population, isCapital
   ============================================================ */

const WORLD_CITIES = [
  // ─── North America ───
  { name: "Washington D.C.", lat: 38.90, lng: -77.04, country: "USA", population: 700000, isCapital: true },
  { name: "New York",   lat: 40.71, lng: -74.01, country: "USA", population: 8340000, isCapital: false },
  { name: "Los Angeles", lat: 34.05, lng: -118.24, country: "USA", population: 3970000, isCapital: false },
  { name: "Chicago",    lat: 41.88, lng: -87.63, country: "USA", population: 2700000, isCapital: false },
  { name: "Houston",    lat: 29.76, lng: -95.37, country: "USA", population: 2300000, isCapital: false },
  { name: "Ottawa",     lat: 45.42, lng: -75.70, country: "CAN", population: 1010000, isCapital: true },
  { name: "Toronto",    lat: 43.65, lng: -79.38, country: "CAN", population: 2930000, isCapital: false },
  { name: "Mexico City",lat: 19.43, lng: -99.13, country: "MEX", population: 9210000, isCapital: true },

  // ─── South America ───
  { name: "Brasília",   lat: -15.79, lng: -47.88, country: "BRA", population: 3050000, isCapital: true },
  { name: "São Paulo",  lat: -23.55, lng: -46.63, country: "BRA", population: 12300000, isCapital: false },
  { name: "Rio de Janeiro", lat: -22.91, lng: -43.17, country: "BRA", population: 6750000, isCapital: false },
  { name: "Buenos Aires", lat: -34.60, lng: -58.38, country: "ARG", population: 3060000, isCapital: true },
  { name: "Lima",       lat: -12.05, lng: -77.04, country: "PER", population: 10750000, isCapital: true },
  { name: "Bogotá",     lat: 4.71, lng: -74.07, country: "COL", population: 7410000, isCapital: true },
  { name: "Santiago",   lat: -33.45, lng: -70.67, country: "CHL", population: 5610000, isCapital: true },

  // ─── Europe ───
  { name: "London",     lat: 51.51, lng: -0.13, country: "GBR", population: 9000000, isCapital: true },
  { name: "Paris",      lat: 48.86, lng: 2.35, country: "FRA", population: 2160000, isCapital: true },
  { name: "Berlin",     lat: 52.52, lng: 13.41, country: "DEU", population: 3770000, isCapital: true },
  { name: "Madrid",     lat: 40.42, lng: -3.70, country: "ESP", population: 3300000, isCapital: true },
  { name: "Rome",       lat: 41.90, lng: 12.50, country: "ITA", population: 2870000, isCapital: true },
  { name: "Kyiv",       lat: 50.45, lng: 30.52, country: "UKR", population: 2960000, isCapital: true },
  { name: "Warsaw",     lat: 52.23, lng: 21.01, country: "POL", population: 1860000, isCapital: true },
  { name: "Ankara",     lat: 39.93, lng: 32.86, country: "TUR", population: 5750000, isCapital: true },
  { name: "Istanbul",   lat: 41.01, lng: 28.98, country: "TUR", population: 15460000, isCapital: false },
  { name: "Amsterdam",  lat: 52.37, lng: 4.90, country: "NLD", population: 870000, isCapital: true },
  { name: "Stockholm",  lat: 59.33, lng: 18.07, country: "SWE", population: 980000, isCapital: true },
  { name: "Athens",     lat: 37.98, lng: 23.73, country: "GRC", population: 664000, isCapital: true },
  { name: "Bucharest",  lat: 44.43, lng: 26.10, country: "ROU", population: 1820000, isCapital: true },

  // ─── Russia & CIS ───
  { name: "Moscow",     lat: 55.76, lng: 37.62, country: "RUS", population: 12540000, isCapital: true },
  { name: "St. Petersburg", lat: 59.93, lng: 30.32, country: "RUS", population: 5380000, isCapital: false },
  { name: "Novosibirsk",lat: 55.03, lng: 82.92, country: "RUS", population: 1630000, isCapital: false },

  // ─── Middle East ───
  { name: "Riyadh",     lat: 24.71, lng: 46.67, country: "SAU", population: 7680000, isCapital: true },
  { name: "Tehran",     lat: 35.70, lng: 51.42, country: "IRN", population: 8700000, isCapital: true },
  { name: "Baghdad",    lat: 33.31, lng: 44.37, country: "IRQ", population: 8130000, isCapital: true },
  { name: "Tel Aviv",   lat: 32.09, lng: 34.78, country: "ISR", population: 460000, isCapital: false },
  { name: "Jerusalem",  lat: 31.77, lng: 35.23, country: "ISR", population: 940000, isCapital: true },
  { name: "Cairo",      lat: 30.04, lng: 31.24, country: "EGY", population: 10230000, isCapital: true },
  { name: "Abu Dhabi",  lat: 24.45, lng: 54.65, country: "ARE", population: 1480000, isCapital: true },
  { name: "Dubai",      lat: 25.20, lng: 55.27, country: "ARE", population: 3330000, isCapital: false },

  // ─── South Asia ───
  { name: "New Delhi",  lat: 28.61, lng: 77.21, country: "IND", population: 16790000, isCapital: true },
  { name: "Mumbai",     lat: 19.08, lng: 72.88, country: "IND", population: 12440000, isCapital: false },
  { name: "Kolkata",    lat: 22.57, lng: 88.36, country: "IND", population: 4500000, isCapital: false },
  { name: "Islamabad",  lat: 33.69, lng: 73.04, country: "PAK", population: 1100000, isCapital: true },
  { name: "Karachi",    lat: 24.86, lng: 67.01, country: "PAK", population: 14910000, isCapital: false },
  { name: "Dhaka",      lat: 23.81, lng: 90.41, country: "BGD", population: 8910000, isCapital: true },

  // ─── East Asia ───
  { name: "Beijing",    lat: 39.90, lng: 116.40, country: "CHN", population: 21540000, isCapital: true },
  { name: "Shanghai",   lat: 31.23, lng: 121.47, country: "CHN", population: 24870000, isCapital: false },
  { name: "Guangzhou",  lat: 23.13, lng: 113.26, country: "CHN", population: 15300000, isCapital: false },
  { name: "Chengdu",    lat: 30.57, lng: 104.07, country: "CHN", population: 16330000, isCapital: false },
  { name: "Tokyo",      lat: 35.68, lng: 139.69, country: "JPN", population: 13960000, isCapital: true },
  { name: "Osaka",      lat: 34.69, lng: 135.50, country: "JPN", population: 2750000, isCapital: false },
  { name: "Seoul",      lat: 37.57, lng: 126.98, country: "KOR", population: 9780000, isCapital: true },
  { name: "Pyongyang",  lat: 39.02, lng: 125.75, country: "PRK", population: 3255000, isCapital: true },

  // ─── Southeast Asia ───
  { name: "Bangkok",    lat: 13.76, lng: 100.50, country: "THA", population: 10540000, isCapital: true },
  { name: "Hanoi",      lat: 21.03, lng: 105.85, country: "VNM", population: 8050000, isCapital: true },
  { name: "Jakarta",    lat: -6.21, lng: 106.85, country: "IDN", population: 10560000, isCapital: true },
  { name: "Manila",     lat: 14.60, lng: 120.98, country: "PHL", population: 1780000, isCapital: true },
  { name: "Singapore",  lat: 1.35, lng: 103.82, country: "SGP", population: 5690000, isCapital: true },
  { name: "Kuala Lumpur", lat: 3.14, lng: 101.69, country: "MYS", population: 1810000, isCapital: true },

  // ─── Africa ───
  { name: "Lagos",      lat: 6.52, lng: 3.38, country: "NGA", population: 15390000, isCapital: false },
  { name: "Abuja",      lat: 9.06, lng: 7.49, country: "NGA", population: 3280000, isCapital: true },
  { name: "Nairobi",    lat: -1.29, lng: 36.82, country: "KEN", population: 4400000, isCapital: true },
  { name: "Cape Town",  lat: -33.92, lng: 18.42, country: "ZAF", population: 4620000, isCapital: false },
  { name: "Pretoria",   lat: -25.75, lng: 28.19, country: "ZAF", population: 2470000, isCapital: true },
  { name: "Johannesburg", lat: -26.20, lng: 28.05, country: "ZAF", population: 5640000, isCapital: false },
  { name: "Addis Ababa",lat: 9.02, lng: 38.75, country: "ETH", population: 3600000, isCapital: true },
  { name: "Algiers",    lat: 36.75, lng: 3.04, country: "DZA", population: 3420000, isCapital: true },
  { name: "Kinshasa",   lat: -4.44, lng: 15.27, country: "COD", population: 14970000, isCapital: true },
  { name: "Dar es Salaam", lat: -6.79, lng: 39.28, country: "TZA", population: 6700000, isCapital: true },

  // ─── Oceania ───
  { name: "Canberra",   lat: -35.28, lng: 149.13, country: "AUS", population: 460000, isCapital: true },
  { name: "Sydney",     lat: -33.87, lng: 151.21, country: "AUS", population: 5310000, isCapital: false },
  { name: "Melbourne",  lat: -37.81, lng: 144.96, country: "AUS", population: 5080000, isCapital: false },
  { name: "Wellington", lat: -41.29, lng: 174.78, country: "NZL", population: 215000, isCapital: true },
  { name: "Auckland",   lat: -36.85, lng: 174.76, country: "NZL", population: 1460000, isCapital: false }
];

/**
 * Get all cities belonging to a country code.
 */
function getCitiesForCountry(countryCode) {
  return WORLD_CITIES.filter(c => c.country === countryCode);
}

/**
 * Get the capital city for a country.
 */
function getCapitalCity(countryCode) {
  return WORLD_CITIES.find(c => c.country === countryCode && c.isCapital) || null;
}

/**
 * Get total city population for a country.
 */
function getCityPopulation(countryCode) {
  return WORLD_CITIES
    .filter(c => c.country === countryCode)
    .reduce((sum, c) => sum + c.population, 0);
}
