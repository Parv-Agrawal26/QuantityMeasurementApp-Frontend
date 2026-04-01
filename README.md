# ⚖️ Quantity Measurement — React Frontend

A React + Bootstrap 5 frontend for the Quantity Measurement Spring Boot API.

## Tech Stack

| Library | Purpose |
|---|---|
| React 18 | UI framework |
| React Router v6 | Client-side routing |
| Axios | HTTP requests to backend API |
| Bootstrap 5.3 | CSS framework & components |
| Bootstrap Icons | Icon library |
| React Toastify | Toast notifications |
| Recharts | Statistics bar chart |
| Vite | Dev server & build tool |

## Project Structure

```
src/
├── context/
│   └── AuthContext.jsx       # Global auth state (token, email, login, logout)
├── services/
│   ├── api.js                # All Axios API calls (authAPI, quantityAPI, historyAPI)
│   └── constants.js          # Units, measurement types, operation names/colors
├── components/
│   ├── AppLayout.jsx         # Sidebar + topbar shell (wraps all pages)
│   ├── QuantityForm.jsx      # Reusable quantity input (value + type + unit)
│   ├── ResultCard.jsx        # Compare / Convert / Arithmetic result displays
│   └── PageHeader.jsx        # Page title + subtitle header
├── pages/
│   ├── AuthPage.jsx          # Login + Register + Google OAuth
│   ├── OAuthCallback.jsx     # Handles OAuth redirect, extracts JWT
│   ├── ComparePage.jsx       # Compare two quantities
│   ├── ConvertPage.jsx       # Unit conversion
│   ├── ArithmeticPage.jsx    # Add / Subtract / Divide
│   ├── HistoryPage.jsx       # Operation history table (auth required)
│   └── StatsPage.jsx         # Statistics + bar chart (auth required)
├── App.jsx                   # Route definitions + ProtectedRoute guard
├── main.jsx                  # React entry point, imports Bootstrap CSS
└── index.css                 # Custom styles (sidebar, cards, results, etc.)
```

## Setup & Running

### Prerequisites
- Node.js 18+ and npm
- Spring Boot backend running on `http://localhost:8080`

### Install & Start

```bash
# Install dependencies
npm install

# Start dev server (proxies /api and /oauth2 to localhost:8080)
npm run dev
```

Open http://localhost:5173 in your browser.

### Build for Production

```bash
npm run build
# Output is in the dist/ folder
```

## Auth Behaviour

| Page | Auth Required |
|---|---|
| Compare | ❌ Public |
| Convert | ❌ Public |
| Arithmetic | ❌ Public |
| History | ✅ Login required |
| Statistics | ✅ Login required |

Unauthenticated users clicking History or Statistics are redirected to `/auth`.
After login they are automatically sent back to the page they requested.

## Backend CORS

The backend `SecurityConfig.java` must allow the Vite dev server origin.
Add `http://localhost:5173` to the allowed origins:

```java
config.setAllowedOrigins(Arrays.asList(
    "http://127.0.0.1:5500",
    "http://localhost:5500",
    "http://localhost:5173"   // ← add this
));
```

## OAuth2 Callback

Configure Google OAuth2 in your Google Cloud Console with the redirect URI:
```
http://localhost:8080/login/oauth2/code/google
```

The backend `OAuth2SuccessHandler` should redirect to:
```
http://localhost:5173/oauth2-callback?token=<JWT>
```

## Changing the Backend URL

The backend server URL can be changed at runtime via the input field in the
top-right of the topbar. The value is saved to `localStorage` under `qm_server`.
Default is `http://localhost:8080`.
