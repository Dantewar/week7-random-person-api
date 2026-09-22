
# Random Person API

A REST API built with Node.js, Express, TypeScript and Zod.

The project fetches data from the RandomUser API, validates external responses and provides a user signup endpoint.

## Technologies

- Node.js
- Express
- TypeScript
- Zod
- Fetch API
- Insomnia

## Project Structure

```text
week7-random-person-api/
├── server/
│   └── server.ts
├── .gitignore
├── package.json
├── package-lock.json
├── tsconfig.json
└── README.md
```

## Installation

Clone the repository and navigate to the project directory.

Install dependencies:

```powershell
npm install
```

Start the development server:

```powershell
npm run dev
```

Build the project:

```powershell
npm run build
```

Start the server:

```powershell
npm start
```

The API runs at:

http://localhost:3000

## API Endpoints

### GET /ping

Checks whether the server is running.

Status: 200 OK

Response:

```json
{
  "message": "pong"
}
```

### GET /random-person

Fetches a random user from the RandomUser API.

The external response is validated using Zod before returning the person's full name and country.

Status: 200 OK

Example response:

```json
{
  "name": "John Smith",
  "country": "Canada"
}
```

Returns 500 Internal Server Error if the external request fails or the response does not match the expected schema.

### POST /users

Accepts user information and validates it using Zod.

Validation rules:

- Name must contain 3–12 characters.
- Age must be between 18 and 100.
- Age defaults to 28 when omitted.
- Email must have a valid format.
- Email is normalized to lowercase.

Example request:

```json
{
  "name": "Dante",
  "age": 47,
  "email": "DANTE@EXAMPLE.COM"
}
```

Status: 201 Created

Example response:

```json
{
  "name": "Dante",
  "age": 47,
  "email": "dante@example.com"
}
```

Invalid input returns 400 Bad Request with Zod validation details.

The endpoint validates and returns the submitted user. It does not store users in a database.

### GET /random-login

Fetches a random user's username and registration date.

The response is validated with Zod.

Status: 200 OK

Example response:

```json
{
  "username": "grumpykoala42",
  "registeredDate": "2014-03-11",
  "summary": "grumpykoala42 (registered on 2014-03-11)"
}
```

Returns 500 Internal Server Error if fetching or validation fails.

## HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | Successful GET request |
| 201 | Valid user submitted |
| 400 | Invalid user input |
| 500 | External API request or validation failure |

## Testing with Insomnia

Create requests using the base URL:

http://localhost:3000

Test the following endpoints:

1. GET /ping
2. GET /random-person
3. POST /users with valid data
4. POST /users with invalid data
5. POST /users without an age
6. GET /random-login

Verify the response status codes and JSON data.

Test error handling by simulating a failed external API request and an invalid external API response.

Restore the original API URL and validation schema after testing.

## Author

Dante