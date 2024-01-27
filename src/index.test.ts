import { strict as assert } from "assert"
import * as fs from "fs"
import { describe, it } from "mocha"
import { createJTW, getAvailability, getForecast } from "./index"

describe("Apple WeatherKit", () => {
	it("works", async () => {
		const privateKey = fs.readFileSync(__dirname + "/../weatherkit.p8", "utf8")

		const token = createJTW({
			teamId: "AT7K7Y62H6",
			serviceId: "val.town.weather",
			keyId: "3JSPU8AVG9",
			privateKey,
			expireAfter: 60, // 1 minute
		})

		assert.ok(token)

		const lat = 38.638
		const lng = -121.259
		const availability = await getAvailability({ lat, lng, token })
		assert.ok(Array.isArray(availability))

		const forecast = await getForecast({ lat, lng, token })
		assert.ok(forecast.forecastDaily)
		assert.ok(forecast.forecastHourly)
	})
})
