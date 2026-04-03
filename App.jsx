import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Tea from './pages/Tea';
import Coffee from './pages/Coffee';
import Snacks from './pages/Snacks';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Invoice from './pages/Invoice';
import OrderSummary from './pages/OrderSummary';
import MyOrders from './pages/MyOrders';
import OrderDetailsPage from './pages/OrderDetailsPage';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

// Admin Components
import AdminRoute from './components/AdminRoute';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';

import './App.css';

function App() {
  return (
    <AuthProvider>
    <CartProvider>
      <Router>
        <div className="app">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/tea" element={<Tea />} />
              <Route path="/coffee" element={<Coffee />} />
              <Route path="/snacks" element={<Snacks />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/order-summary" element={<ProtectedRoute><OrderSummary /></ProtectedRoute>} />
              <Route path="/my-orders" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
              <Route path="/order/:id" element={<ProtectedRoute><OrderDetailsPage /></ProtectedRoute>} />
              <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
              <Route path="/invoice" element={<ProtectedRoute><Invoice /></ProtectedRoute>} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<Profile />} />

              {/* Admin Routes */}
              <Route 
                path="/admin/*" 
                element={
                  <AdminRoute>
                    <AdminLayout>
                      <Routes>
                        <Route path="/" element={<AdminDashboard />} />
                        <Route path="/products" element={<AdminProducts />} />
                        <Route path="/orders" element={<AdminOrders />} />
                      </Routes>
                    </AdminLayout>
                  </AdminRoute>
                } 
              />
            </Routes>
          </main>
        </div>
        <ToastContainer />
      </Router>
    </CartProvider>
    </AuthProvider>
  );
}

export default App;
