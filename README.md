# Weather API Subscription Service

A NestJS application that allows users to subscribe to weather updates for a specific city via email. Users can choose the frequency of updates (hourly or daily) and manage their subscriptions.

## Table of Contents

- [Features](#Features)
- [Technologies](#Technologies)
- [Environment Variables](#Environment-Variables)
- [Installation](#Installation)
- [Running the App](#Running-the-App)
- [API Endpoints](#API-Endpoints)
- [Data Model](#Data-Model)
- [Cron Jobs](#Cron-Jobs)
- [Author](#Author)

---

## Features

- Subscribe to weather updates by email
- Confirm subscriptions via email link
- Unsubscribe using a secure token
- Get current weather via API
- Scheduled email notifications (hourly/daily)
- Weather data via [WeatherAPI.com](https://www.weatherapi.com/)
- Email delivery using SMTP (Gmail)
- PostgreSQL database (via Prisma)

## Technologies

- <b>Node.js</b> + NestJS
- <b>PostgreSQL</b> with <b>Prisma ORM</b>
- <b>WeatherAPI</b> for weather data
- <b>Nodemailer</b> via `@nestjs-modules/mailer`
- <b>Cron jobs</b> using `@nestjs/schedule`

## Environment Variables
Create a `.env` file with the following structure:

```dotenv
# Weather API
WEATHER_API_KEY=
WEATHER_API_BASE_URL=

# App Config
APP_PROTOCOL=
APP_HOST=
APP_PORT=
APP_URL=

# PostgreSQL
POSTGRES_USER=
POSTGRES_PASSWORD=
POSTGRES_HOST=
POSTGRES_PORT=
POSTGRES_DATABASE=
POSTGRES_URI=

# Email
MAIL_HOST=
MAIL_PORT=
MAIL_USER=
MAIL_PASS=
```

## Installation
```bash
git clone https://github.com/Crosshell/weather-api
cd weather-api
npm install
```

## Running the App
```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod

```
Ensure PostgreSQL is running and the database specified in your `.env` is created

### Prisma
```bash
npx prisma generate
npx prisma migrate dev --name init
```

## API Endpoints
### Weather
- <b>GET</b> `/weather?city={city}`

Returns current weather for the provided city

### Subscription
- <b>POST</b> `/subscribe`

Subscribes a user to weather updates

<b>Body:</b>
```json
{
  "email": "user@example.com",
  "city": "London",
  "frequency": "hourly"
}
```

- <b>GET</b> `/confirm/:token`

Confirms the subscription using a token

- <b>GET</b> `/unsubscribe/:token`

Unsubscribes the user using a token

## Data Model
```prisma
enum FrequencyType {
  hourly
  daily
}

model Subscription {
  id        String        @id @default(uuid())
  email     String        @unique
  city      String
  frequency FrequencyType
  confirmed Boolean       @default(false)
  token     String        @unique
}
```

## Cron Jobs

- <b>Hourly Email:</b> Runs every hour (`0 * * * *`)
- <b>Daily Email:</b> Runs daily at midnight (`0 0 * * *`)

## Author
- GitHub: [Crosshell](https://github.com/Crosshell)