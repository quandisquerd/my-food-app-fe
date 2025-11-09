import { useEffect, useState } from "react";

const CartNotification = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleCartUpdate = () => {
      setVisible(true);

      // Ẩn sau 3 giây
      setTimeout(() => setVisible(false), 3000);
    };

    window.addEventListener("cartUpdated", handleCartUpdate);
    return () => window.removeEventListener("cartUpdated", handleCartUpdate);
  }, []);

  if (!visible) return null;

  return (
    <div
      className="
        fixed bottom-24 right-5 
        bg-white border border-gray-300 shadow-lg 
        rounded-lg px-4 py-3 w-64
        flex flex-col gap-1
        animate-fade-in-up
        z-[60]
      "
    >
      <span className="text-black font-semibold">🛒 Thanh toán thôi nào!</span>
      <span className="text-sm text-gray-500">
        👉 Hãy thanh toán ngay tại biểu tượng giỏ hàng.
      </span>
    </div>
  );
};

export default CartNotification;
