# Zara Challenge - Mobile Phone Catalog

Technical assessment consisting of a web application for browsing, searching, and managing a catalog of mobile phones.

## Features

- Phone catalog displaying the first 20 products from the API.
- Real-time search by phone name or brand.
- Product detail page.
- Dynamic price updates based on selected storage and color.
- Similar products section.
- Shopping cart management.
- Cart persistence using Local Storage.
- Responsive design.
- Accessibility considerations.
- Unit testing.
- Development and production builds.

---

## Unit Tests Coverage

Unit tests are implemented for the following areas:

### Pages

- HomePage
- DetailPage
- CartPage

### API

- `services/api.ts` (API integration and data fetching logic)

### What is tested

- Component rendering
- User interactions
- Cart state updates
- Navigation flows
- API success and error handling

---

## Extra Features / Enhancements

In addition to the required functionality, the following improvements were implemented:

### Home improvements

- Prevention of issues related to duplicated product IDs in cart operations.
- Added a **"Ver más"** button to load additional products progressively.
- Maintains the requirement of initially displaying only the first 20 products from the API.

### Cart improvements

- Added quantity controls (+ / -) to increase or decrease item quantity directly from the cart.

---

## Tech Stack

### Frontend

| Technology        | Version  |
| ----------------- | -------- |
| React             | 18.3.1   |
| TypeScript        | 5.6.2    |
| React Router DOM  | 7.x      |
| SASS              | Latest   |
| React Context API | Built-in |

### Tooling

| Technology | Version |
| ---------- | ------- |
| Node.js    | 18.x    |
| Vite       | 5.4.x   |
| ESLint     | 9.13.0  |
| Prettier   | Latest  |

### Testing

| Technology            | Version |
| --------------------- | ------- |
| Vitest                | Latest  |
| React Testing Library | Latest  |
| Jest DOM              | Latest  |

---

## Project Structure

```text
src/
│
├── services/
│   └── api.ts
│
├── components/
│   ├── Navbar/
│   ├── ProductCard/
│   ├── SearchBar/
│   └── ...
│
├── context/
│   └── CartContext.tsx
│
├── hooks/
│
├── pages/
│   ├── HomePage/
│   ├── DetailPage/
│   └── CartPage/
│
├── routes/
│   └── AppRoutes.tsx
│
├── styles/
│   ├── global.scss
│   └── variables.scss
│
```

---

## Installation

### Prerequisites

- Node.js 18+
- npm 9+

### Install dependencies

```bash
npm install
```

---

## Development Mode

Start the development server:

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:5173
```

---

## Production Mode

Run the production build:

```bash
npm run build
```

Run the production server:

```bash
npm run preview
```

The application will be available at:

```text
http://localhost:4173/
```

---

## Available Scripts

- `npm run dev` → Start development server
- `npm run build` → Build production application
- `npm run preview` → Preview production build locally
- `npm run lint` → Run ESLint checks
- `npm run format` → Format code using Prettier
- `npm run test` → Run unit tests

---

## Architecture

The application follows a component-based architecture using React and TypeScript.

### State Management

React Context API is used for:

- Shopping cart state.
- Cart persistence via Local Storage.

### Routing

React Router is used for navigation between:

- Home Page
- Product Detail Page
- Cart Page

### Styling

SASS Modules are used for component-level styling, while global styles are managed through shared SCSS files.

### API Integration

The application consumes the provided API using the required `x-api-key` authentication header.

---

## Author

Eduardo Juarez
Frontend Engineer
