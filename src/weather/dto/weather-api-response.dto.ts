interface Location {
  name: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
  tz_id: string;
  localtime_epoch: number;
  localtime: string;
}

export class WeatherApiResponseDto {
  location: Location;
  current: {
    temp_c: number;
    condition: {
      text: string;
    };
    humidity: number;
  };
}
