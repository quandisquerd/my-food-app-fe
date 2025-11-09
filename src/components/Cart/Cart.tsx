import { useEffect, useState } from "react";
import { ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import DrawerCart from "../DrawerCart/DrawerCart";

const Cart = () => {
  const [count, setCount] = useState(0);
const [isOpen, setIsOpen] = useState(false);
  const [shake, setShake] = useState(false);
  // Hàm tính tổng số lượng sản phẩm trong giỏ
  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    // Tính tổng quantity của tất cả sản phẩm
    const total = cart.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0);
    setCount(total);
  };

  useEffect(() => {
    // Cập nhật ban đầu
    updateCartCount();

    // Lắng nghe sự kiện khi giỏ hàng được update
    const handleCartUpdate = () => updateCartCount();

    window.addEventListener("cartUpdated", handleCartUpdate);
    return () => window.removeEventListener("cartUpdated", handleCartUpdate);
  }, []);

  return (
    <>
    <button
        onClick={() => setIsOpen(true)}
      className={`
        fixed bottom-5 right-7
        bg-red-600 text-white p-4 rounded-full shadow-lg
        flex items-center justify-center
        hover:bg-blue-700 transition-all duration-300
        z-50
         ${count > 0 ? "shake " : ""}
      `}
    >
      <ShoppingCart size={24} />
      {count > 0 && (
        <span className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded-full">
          {count}
        </span>
      )}
    </button>
     <DrawerCart isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};

export default Cart;
