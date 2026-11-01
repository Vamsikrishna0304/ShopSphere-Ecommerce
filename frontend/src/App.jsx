import React from 'react';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import CartDrawer from './components/cart/CartDrawer';
import ToastContainer from './components/common/ToastContainer';
import AppRoutes from './routes/AppRoutes';

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <AppRoutes />
      </main>
      <Footer />
      <CartDrawer />
      <ToastContainer />
    </>
  );
}
