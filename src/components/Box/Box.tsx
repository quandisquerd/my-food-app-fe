import { Heart, Minus, Plus, View } from "lucide-react";
import logo from "../../assets/logo.jpg";
import { formatCurrency } from "../../utils/formatCurrency";

const Box = ({ data }: any) => {
  const AddToCart = () => {
    console.log("Đã thêm:", data);

    // Lấy giỏ hàng từ local
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");

    // Tìm xem sản phẩm đã tồn tại chưa
    const existingItemIndex = cart.findIndex((item: any) => item.id === data.id);

    if (existingItemIndex !== -1) {
      // Nếu đã có -> tăng số lượng
      cart[existingItemIndex].quantity = (cart[existingItemIndex].quantity || 1) + 1;
    } else {
      // Nếu chưa có -> thêm mới với quantity = 1
      cart.push({ ...data, quantity: 1 });
    }

    // Lưu lại vào localStorage
    localStorage.setItem("cart", JSON.stringify(cart));

    // Gửi event để cập nhật hiển thị
    window.dispatchEvent(new Event("cartUpdated"));
  };

  return (
    <div className="bg-gray-300 rounded-2xl shadow-md hover:scale-105 transition-transform duration-300 cursor-pointer text-center overflow-hidden w-full">
      <img
        src={data?.image ? data?.image : logo}
        alt={data?.name}
        className="w-full h-40 object-cover"
      />

      <div className="p-4 flex flex-col justify-between">
        <div>
          <h1 className="text-lg font-semibold text-gray-800">{data?.name}</h1>
          <p className="text-sm text-gray-400">{data?.description}</p>
        </div>
        <h2 className="text-md text-red-600 mt-1 font-bold">{formatCurrency(data?.price)}</h2>
      </div>

      <div className="p-4 flex justify-between items-center gap-x-2">
        <button className="p-2 bg-blue-500 text-white rounded text-sm flex-grow mx-1 whitespace-nowrap overflow-hidden text-ellipsis" onClick={() => AddToCart()}>
          Thêm vào giỏ hàng
        </button>
      </div>

    </div>
  );
};


export default Box;
