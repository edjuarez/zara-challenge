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

## Tech Stack

### Frontend

| Technology | Version |
|------------|-----------|
| React | 18.3.1 |
| TypeScript | 5.6.2 |
| React Router DOM | 7.x |
| SASS | Latest |
| React Context API | Built-in |

### Tooling

| Technology | Version |
|------------|-----------|
| Node.js | 18.x |
| Vite | 5.4.x |
| ESLint | 9.13.0 |
| Prettier | Latest |

### Testing

| Technology | Version |
|------------|-----------|
| Vitest | Latest |
| React Testing Library | Latest |
| Jest DOM | Latest |

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
├── types/
│
└── utils/
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

## Available Scripts

```bash
npm run dev
```

Runs the application in development mode.

```bash
npm run build
```

Builds the application for production.

```bash
npm run preview
```

Serves the production build locally.

```bash
npm run lint
```

Runs ESLint checks.

```bash
npm run format
```

Formats the codebase using Prettier.

```bash
npm run test
```

Runs unit tests.

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
- Shopping Cart Page

### Styling

SASS Modules are used for component-level styling, while global styles are managed through shared SCSS files.

### API Integration

The application consumes the provided API using the required `x-api-key` authentication header.

---

## Author

Eduardo Juarez
Frontend Engineer