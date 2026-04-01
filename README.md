# ⚖️ Quantity Measurement — React Frontend

A modern React + Bootstrap 5 frontend for the Quantity Measurement Spring Boot API.

## 🚀 Overview

This project provides:

- Compare quantities across measurement types (e.g., length, weight, volume)
- Convert values between units
- Arithmetic operations on quantities: add, subtract, divide
- History records (requires login)
- Usage statistics with a bar chart (requires login)
- Email/password authentication and Google OAuth2 login support
- Safe navigation with route guards for private pages

## 🧩 Tech Stack

- React 18
- React Router v6
- Vite (fast dev server and build tool)
- Axios (HTTP client)
- Bootstrap 5 (+ Bootstrap Icons)
- React Toastify
- Recharts

## 📁 Project Structure

```
src/
├── components/
│   ├── AppLayout.jsx         # Main layout (sidebar + topbar + content outlet)
│   ├── PageHeader.jsx        # Section title + subtitle
│   ├── QuantityForm.jsx      # Shared quantity input UI (amount + type + unit)
│   └── ResultCard.jsx        # Shows computed result
├── context/
│   └── AuthContext.jsx       # Stores auth state (token, user, login/logout)
├── pages/
│   ├── AuthPage.jsx          # Login/Register form + Google OAuth
│   ├── OAuthCallback.jsx     # Handles OAuth redirect callback
│   ├── ComparePage.jsx       # Compare two quantities
│   ├── ConvertPage.jsx       # Convert one quantity to another unit
│   ├── ArithmeticPage.jsx    # Add/Subtract/Divide with two quantities
│   ├── HistoryPage.jsx       # Past operations (protected)
│   └── StatsPage.jsx         # Operation count chart (protected)
├── services/
│   ├── api.js                # Axios wrapper: authAPI, quantityAPI, historyAPI
│   └── constants.js          # Units, measurement lists, colors, operation mapping
├── App.jsx                   # App routes + protected route guard
├── main.jsx                  # App bootstrap with ReactDOM
└── index.css                 # Custom styles
```

## 🧭 Routing

- `/auth`: login/register page
- `/oauth2-callback`: receives OAuth2 token and sets auth state
- `/compare`: public compare page
- `/convert`: public convert page
- `/arithmetic`: public arithmetic page
- `/history`: protected history page (requires login)
- `/stats`: protected stats page (requires login)
- Any unknown route auto-redirects to `/compare`

## 🔐 Authentication & Authorization

- React context handles `isLoggedIn`, `token`, and `userEmail`.
- Protected Route wrapper (`ProtectedRoute`) redirects unauthenticated users to `/auth?redirect=true`.
- Login, register, logout endpoints:
  - `POST /api/v1/auth/login`
  - `POST /api/v1/auth/register`
  - `POST /api/v1/auth/logout`

## 🔌 API Endpoints

### Quantities (open)
- `POST /api/v1/quantities/compare`
- `POST /api/v1/quantities/convert`
- `POST /api/v1/quantities/add`
- `POST /api/v1/quantities/subtract`
- `POST /api/v1/quantities/divide`

### History & Stats (protected)
- `GET /api/v1/quantities/history`
- `GET /api/v1/quantities/history/:operation`
- `GET /api/v1/quantities/count/:operation`
- aggregated count via repeated `GET /api/v1/quantities/count/:operation`

### Base URL
- default: `http://localhost:8080`
- runtime override in topbar saved to `localStorage.qm_server`

## 🛠️ Local Setup

### Prerequisites
- Node.js 18+ / npm
- Backend running on `http://localhost:8080`

### Install

```bash
npm install
```

### Run (development)

```bash
npm run dev
```

Open `http://localhost:5173`.

### Build (production)

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

## 💡 CORS & OAuth Tips

- Backend CORS must allow `http://localhost:5173`.
- Google OAuth2 redirect URI should be configured as:
  - `http://localhost:8080/login/oauth2/code/google`
- Backend should redirect successful OAuth login to:
  - `http://localhost:5173/oauth2-callback?token=<JWT>`

## 📘 UX details

- Toasts appear top-right with 3-second auto-close.
- Public pages: compare/convert/arithmetic.
- Private pages: history/stats (guarded for valid JWT).
- Unauthenticated attempt to private page redirects to `/auth` and then back to original page after login.

## 🧪 Testing pointers

- Validate quantity conversion with known values (e.g., 1 meter = 100 cm).
- Compare incompatible types should show error from backend.
- Arithmetic operations should respect unit conversion rules.
- History and stats should reflect performed operations after login.

## 🧹 Code standards

- `.jsx` components are functional and hook-based.
- `services/api.js` centralizes backend calls and token injection.
- `context/AuthContext.jsx` manages auth state and persistence in `localStorage`.

## 📦 Dependencies

- `react`, `react-dom`, `react-router-dom`, `axios`, `bootstrap`, `bootstrap-icons`, `react-toastify`, `recharts`
- dev: `vite`, `@vitejs/plugin-react`, `@types/react`, `@types/react-dom`


