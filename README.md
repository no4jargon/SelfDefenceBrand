# Self Defence Brand landing page

A single-page site for a self-defence brand with two interactive forms backed by a lightweight Express API.

## Getting started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the server:
   ```bash
   npm start
   ```
   The site and API will be available at `http://localhost:3000` (or the port defined in `PORT`).

## API endpoints

- `POST /api/contact`
  - Request body: `{ fullName: string, phone: string }`
  - Stores a contact request and returns `{ success: true }` on success.

- `POST /api/survey`
  - Request body: `{ nameChoice?: string, customName?: string, surveyName?: string, surveyPhone?: string }`
  - Stores a name preference along with optional contact info and returns `{ success: true }` on success.

Submissions are persisted to `data/submissions.json` (ignored by git) with timestamps.
