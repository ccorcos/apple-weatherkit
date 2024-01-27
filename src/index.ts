import jwt from "jsonwebtoken"

export function createJTW(args: {
	/** This value is your 10-character Team ID from your developer account. */
	teamId: string
	serviceId: string
	/** A 10-character key identifier you obtain from your developer account. */
	keyId: string
	privateKey: string
	/** Number of seconds */
	expireAfter: number
}) {
	const header = {
		/** The algorithm with which to sign the token. Set the value to ES256. */
		alg: "ES256",
		/** A 10-character key identifier you obtain from your developer account. */
		kid: args.keyId,
		/** An identifier that consists of your 10-character Team ID and Service ID, separated by a period. */
		id: [args.teamId, args.serviceId].join("."),
	}
	const payload = {
		/** The issuer claim key. This value is your 10-character Team ID from your developer account. */
		iss: args.teamId,
		/** The issued-at claim key. This value indicates the time at which the token was generated. The value is the number of seconds since epoch in Universal Coordinated Time. */
		iat: Math.round(Date.now() / 1000),
		/** The expiration time claim key. This value indicates the time after which the token is not accepted by the server. The value is the number of seconds since epoch in Universal Coordinated Time. */
		exp: Math.round(Date.now() / 1000 + args.expireAfter),
		/** The subject public claim key. This value is your registered Service ID. */
		sub: args.serviceId,
	}

	const token = jwt.sign(payload, args.privateKey, { header })

	return token
}

export async function getAvailability(args: {
	lat: number
	lng: number
	token: string
	country?: string
}) {
	const response = await fetch(
		`https://weatherkit.apple.com/api/v1/availability/${args.lat}/${
			args.lng
		}/?country=${args.country || "US"}`,
		{
			headers: {
				Authorization: `Bearer ${args.token}`,
			},
		}
	)
	const result = await response.json()

	return result as DataSets
}

export async function getForecast(args: {
	token: string
	lat: number
	lng: number
	dataSets?: DataSets
}) {
	const url = new URL(
		`https://weatherkit.apple.com/api/v1/weather/en/${args.lat}/${args.lng}/`
	)
	url.searchParams.set(
		"dataSets",
		args.dataSets ? args.dataSets.join(",") : "forecastDaily,forecastHourly"
	)

	const response = await fetch(url, {
		headers: {
			Authorization: `Bearer ${args.token}`,
		},
	})
	const result = await response.json()
	return result as WeatherKitResponse
}

export type DataSets = Array<
	| "currentWeather"
	| "forecastDaily"
	| "forecastHourly"
	| "forecastNextHour"
	| "weatherAlerts"
>

// https://github.com/sprinkler/node-apple-weatherkit/blob/master/src/types/Weather.ts
export interface WeatherKitResponse {
	currentWeather?: CurrentWeather
	forecastDaily?: ForecastDaily
	forecastHourly?: ForecastHourly
}

export interface CurrentWeather {
	name: string
	metadata: Metadata
	asOf: string
	cloudCover: number
	conditionCode: string
	daylight: boolean
	humidity: number
	precipitationIntensity: number
	pressure: number
	pressureTrend: string
	temperature: number
	temperatureApparent: number
	temperatureDewPoint: number
	uvIndex: number
	visibility: number
	windDirection: number
	windGust: number
	windSpeed: number
}

export interface Metadata {
	attributionURL: string
	expireTime: string
	latitude: number
	longitude: number
	readTime: string
	reportedTime: string
	units: string
	version: number
}

export interface ForecastDaily {
	name: string
	metadata: Metadata
	days: Day[]
}

export interface Day {
	forecastStart: string
	forecastEnd: string
	conditionCode: string
	maxUvIndex: number
	moonPhase: string
	moonrise?: string
	moonset: string
	precipitationAmount: number
	precipitationChance: number
	precipitationType: string
	snowfallAmount: number
	solarMidnight: string
	solarNoon: string
	sunrise: string
	sunriseCivil: string
	sunriseNautical: string
	sunriseAstronomical: string
	sunset: string
	sunsetCivil: string
	sunsetNautical: string
	sunsetAstronomical: string
	temperatureMax: number
	temperatureMin: number
	daytimeForecast: DaytimeForecast
	overnightForecast: OvernightForecast
	restOfDayForecast?: RestOfDayForecast
}

export interface DaytimeForecast {
	forecastStart: string
	forecastEnd: string
	cloudCover: number
	conditionCode: string
	humidity: number
	precipitationAmount: number
	precipitationChance: number
	precipitationType: string
	snowfallAmount: number
	windDirection: number
	windSpeed: number
}

export interface OvernightForecast {
	forecastStart: string
	forecastEnd: string
	cloudCover: number
	conditionCode: string
	humidity: number
	precipitationAmount: number
	precipitationChance: number
	precipitationType: string
	snowfallAmount: number
	windDirection: number
	windSpeed: number
}

export interface RestOfDayForecast {
	forecastStart: string
	forecastEnd: string
	cloudCover: number
	conditionCode: string
	humidity: number
	precipitationAmount: number
	precipitationChance: number
	precipitationType: string
	snowfallAmount: number
	windDirection: number
	windSpeed: number
}

export interface ForecastHourly {
	name: string
	metadata: Metadata
	hours: Hour[]
}

export interface Hour {
	forecastStart: string
	cloudCover: number
	conditionCode: string
	daylight: boolean
	humidity: number
	precipitationAmount: number
	precipitationIntensity: number
	precipitationChance: number
	precipitationType: string
	pressure: number
	pressureTrend: string
	snowfallIntensity: number
	snowfallAmount: number
	temperature: number
	temperatureApparent: number
	temperatureDewPoint: number
	uvIndex: number
	visibility: number
	windDirection: number
	windGust: number
	windSpeed: number
}
