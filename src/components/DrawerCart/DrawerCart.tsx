import { X, Plus, Minus } from "lucide-react";
import { useEffect, useState } from "react";
import { formatCurrency } from "../../utils/formatCurrency";
import CheckoutModal from "../Cart/CheckoutModal";
import Checkout from "../Cart/Checkout";

interface DrawerCartProps {
  isOpen: boolean;
  onClose: () => void;
}

const DrawerCart = ({ isOpen, onClose }: DrawerCartProps) => {
  const [cartItems, setCartItems] = useState<any[]>([]);
const [showCheckout, setShowCheckout] = useState(false);
  // Lấy dữ liệu từ localStorage
  const loadCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartItems(cart);
  };

  useEffect(() => {
    if (isOpen) loadCart();
  }, [isOpen]);

  // Cập nhật lại cart trong localStorage
  const updateCart = (newCart: any[]) => {
    localStorage.setItem("cart", JSON.stringify(newCart));
    setCartItems(newCart);
    window.dispatchEvent(new Event("cartUpdated"));
  };

  // Tăng số lượng
  const handleIncrease = (id: number) => {
    const updatedCart = cartItems.map((item) =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    updateCart(updatedCart);
  };

  // Giảm số lượng (và confirm xoá nếu = 1)
  const handleDecrease = (id: number) => {
    const item = cartItems.find((i) => i.id === id);
    if (!item) return;

    if (item.quantity === 1) {
      const confirmDelete = window.confirm(
        `Bạn có chắc muốn xoá "${item.name}" khỏi giỏ hàng không?`
      );
      if (!confirmDelete) return;

      const updatedCart = cartItems.filter((i) => i.id !== id);
      updateCart(updatedCart);
    } else {
      const updatedCart = cartItems.map((i) =>
        i.id === id ? { ...i, quantity: i.quantity - 1 } : i
      );
      updateCart(updatedCart);
    }
  };
const totalPrice = cartItems.reduce(
  (sum, item) => sum + item.price * item.quantity,
  0
);
  return (
    <>
      {/* Nền mờ */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black bg-opacity-40 z-40"
        />
      )}

      {/* Drawer bên phải */}
      <div
        className={`fixed top-0 right-0 h-full bg-white shadow-2xl z-50 transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "translate-x-full"}
        w-1/4 min-w-[320px] flex flex-col`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Giỏ hàng</h2>
          <button onClick={onClose}>
            <X className="text-gray-600 hover:text-black" />
          </button>
        </div>

        {/* Nội dung */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cartItems.length > 0 ? (
            cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between bg-gray-100 p-3 rounded-lg shadow-sm"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-12 h-12 object-cover rounded"
                />
                <div className="flex-1 ml-3 text-left">
                  <h3 className="text-sm font-semibold">{item.name}</h3>
                  <p className="text-xs text-gray-500">
                    {formatCurrency(item.price)}
                  </p>
                  {/* Nút tăng/giảm */}
                  <div className="flex items-center gap-2 mt-1">
                    <button
                      onClick={() => handleDecrease(item.id)}
                      className="p-1 bg-gray-300 rounded hover:bg-gray-400"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="text-sm font-medium">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleIncrease(item.id)}
                      className="p-1 bg-gray-300 rounded hover:bg-gray-400"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                <p className="text-sm font-bold text-red-500 ml-2">
                  {formatCurrency(item.quantity * Number(item.price))}
                </p>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 mt-10">Giỏ hàng trống</p>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t">
          <button
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 mb-5"
             onClick={() => setShowCheckout(true)}
          >
            🛒 Thanh toán
          </button>
        </div>
      </div>
      <Checkout isOpen={showCheckout} totalAmount={totalPrice} onClose={() => setShowCheckout(false)} />

    </>
  );
};

export default DrawerCart;
