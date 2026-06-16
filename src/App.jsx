import { BrowserRouter, Routes, Route } from "react-router-dom"
import { CartProvider } from "./context/CartContext"
import Home from "./pages/Home"
import Checkout from "./pages/Checkout"
import AdminLogin from "./pages/AdminLogin"
import AdminDashboard from "./pages/AdminDashboard"
import AdminProtectedRoute from "./pages/AdminProtectedRoute"

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  )
}

export default App