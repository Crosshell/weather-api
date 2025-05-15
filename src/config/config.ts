export default () => ({
  weatherApi: {
    key: process.env.WEATHER_API_KEY,
    baseUrl: process.env.WEATHER_API_BASE_URL,
  },
});
