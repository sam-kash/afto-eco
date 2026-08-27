import Navbar from './Navbar';
import CartSidebar from './Cart/CartSidebar';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main>{children}</main>
      <CartSidebar />
    </div>
  );
}