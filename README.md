# Apple WeatherKit

## Getting Started

```sh
npm i apple-weatherkit
```

Read [Apple's documentation](https://developer.apple.com/documentation/weatherkitrestapi/request_authentication_for_weatherkit_rest_api) to get the requisite information.

```ts
import { createJTW, getAvailability, getForecast } from "apple-weatherkit";

const token = createJTW({
  teamId: "XXXXXXXXXX",
  serviceId: "com.example.weather",
  keyId: "YYYYYYYYYY",
  privateKey: process.env.APPLE_WEATHERKIT_KEY,
  expireAfter: 60 * 60, // 1hour
});

const lat = 38.638;
const lng = -121.259;

getAvailability({ lat, lng, token }).then((result) =>
  console.log("Availability", result)
);

getForecast({ lat, lng, token }).then((result) =>
  console.log("Forecast", result)
);
```
