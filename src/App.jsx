import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import Account from './pages/Account';
import Product from './pages/Product';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Delivery from './pages/Delivery';
import Payment from './pages/Payment';
import Success from './pages/Success';
import Collections from './pages/Collections';
import AdminLayout from './components/AdminLayout';
import ForgetPassword from './pages/Auth/ForgetPassword';
import ProtectedRoute from './components/ProtectedRoute';

import ProductsAdmin from './pages/admin/ProductsAdmin';
import OrdersAdmin from './pages/admin/OrdersAdmin';
import AdminDashboard from './pages/admin/AdminDashboard';
import UsersAdmin from './pages/admin/UsersAdmin';
import CouponsAdmin from './pages/admin/CouponsAdmin';
import CartsAdmin from './pages/admin/CartsAdmin';
import CategoriesAdmin from './pages/admin/CategoriesAdmin';
import Contact from './pages/Contact';

import Category from './pages/Category';

const App = () => {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/collections" element={<Collections />} />
          <Route path="/category/:categoryName" element={<Category />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/forgot-password" element={<ForgetPassword />} />

          {/* Protected user routes - require login */}
          <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
          <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
          <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path="/delivery" element={<ProtectedRoute><Delivery /></ProtectedRoute>} />
          <Route path="/payment" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
          <Route path="/success" element={<ProtectedRoute><Success /></ProtectedRoute>} />

          {/* Admin routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<ProductsAdmin />} />
            <Route path="categories" element={<CategoriesAdmin />} />
            <Route path="orders" element={<OrdersAdmin />} />
            <Route path="users" element={<UsersAdmin />} />
            <Route path="coupons" element={<CouponsAdmin />} />
            <Route path="carts" element={<CartsAdmin />} />
          </Route>

        </Routes>
     
    </Router>
  );
};

export default App;
