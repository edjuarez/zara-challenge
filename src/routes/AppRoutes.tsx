import { Routes, Route } from "react-router-dom";

import HomePage from "../pages/HomePage/HomePage";
import DetailPage from "../pages/DetailsPage/DetailsPage";
// import CartPage from "../pages/CartPage/CartPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/product/:id" element={<DetailPage />} />
      {/* <Route path="/cart" element={<CartPage />} /> */}
    </Routes>
  );
}