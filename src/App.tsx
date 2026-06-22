import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { Navbar } from "./components/Navbar/Navbar";
import { CartProvider } from "./context/CartContext";

export default function App() {
  return (
    <CartProvider>
      <Router>
        <header className="header"><Navbar /></header>
          
          <main className="main-content">
            <AppRoutes />
          </main>
      </Router>
    </CartProvider>
  );
}