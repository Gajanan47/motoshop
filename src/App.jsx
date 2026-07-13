import { BrowserRouter, Routes, Route } from "react-router-dom"
import { CartProvider } from "./context/CartContext"
import Home from "./pages/Home"
import Checkout from "./pages/Checkout"
import AdminLogin from "./pages/AdminLogin"
import AdminDashboard from "./pages/AdminDashboard"
import AdminProtectedRoute from "./pages/AdminProtectedRoute"
import ProductDetails from "./pages/ProductDetails"
import Navbar from "./components/Navbar"
import CartModal from "./components/CartModal"
import OrderDetails from "./pages/OrderDetails"
import Login from "./pages/Login"
import Register from "./pages/Register"
import MyOrders from "./pages/MyOrders"
import ProtectedRoute from "./pages/ProtectedRoute"
import Profile from "./pages/Profile"
import Addresses from "./pages/Addresses"
import LoginSecurity from "./pages/LoginSecurity"
import ReAuth from "./pages/ReAuth"
import ChatBot from "./components/ChatBot"
function App() {
  return (
    <CartProvider>
      <BrowserRouter>
       
        <Routes>
          <Route path="/login" element={<><Navbar /><Login /></>} />
          <Route path="/register" element={<><Navbar /><Register /></>} />
          <Route path="/my-orders" element={<ProtectedRoute><Navbar /><MyOrders /></ProtectedRoute>} />
          <Route path = "/profile" element={<ProtectedRoute><Navbar /><Profile /></ProtectedRoute>}/>
          <Route path="/account/addresses" element={<><Navbar /><Addresses /></>}/>
          <Route path="/account/reauth" element={<ReAuth/>}/>
          <Route path="/account/login-security" element={<><Navbar/><LoginSecurity/></>}/>
          <Route path="/" element={
          <>
              <Navbar /><Home />
              </>
              }
            />
          <Route path="/checkout" element={<ProtectedRoute> <Checkout /></ProtectedRoute>} />
          <Route path="/products/:id" element={<><Navbar /> <ProductDetails /></>} />
          <Route path="/admin/login" element={<> <AdminLogin /></>} />
          <Route path="/admin" element={
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>
          } />
          <Route path="/admin/orders/:id" element={
            <AdminProtectedRoute>
              <OrderDetails/>
            </AdminProtectedRoute>
          } />
        </Routes>
        <CartModal />
        <ChatBot />
     
      </BrowserRouter>
    </CartProvider>
  )
}

export default App
