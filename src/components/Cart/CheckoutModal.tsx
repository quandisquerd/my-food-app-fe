import { X, QrCode } from "lucide-react";
import React from "react";
import { formatCurrency } from "../../utils/formatCurrency";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  total: number;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, total }) => {
  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const phone = "0369123456"; // 👉 số Zalo của bạn
    window.open(`https://zalo.me/${phone}`, "_blank");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      {/* Nền mờ */}
      <div
        className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal chính */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-[420px] p-6 animate-fadeIn z-50">
        {/* Nút đóng */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          <X size={22} />
        </button>

        {/* Tiêu đề */}
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-2">
          Thanh toán đơn hàng
        </h2>
        <p className="text-center text-gray-500 text-sm mb-5">
          Vui lòng nhập thông tin giao hàng để tiến hành thanh toán
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Họ tên</label>
            <input
              required
              type="text"
              placeholder="Nguyễn Văn A"
              className="w-full border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Số điện thoại</label>
            <input
              required
              type="tel"
              placeholder="098x xxx xxx"
              className="w-full border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Địa chỉ</label>
            <textarea
              required
              placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
              className="w-full border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            ></textarea>
          </div>

          {/* Tổng tiền */}
          <div className="bg-gray-50 p-3 rounded-xl flex justify-between items-center mt-3">
            <span className="text-gray-600 font-medium">Tổng thanh toán:</span>
            <span className="text-xl font-bold text-red-600">
              {formatCurrency(total)}
            </span>
          </div>

          {/* Nút thanh toán */}
          <div className="flex flex-col gap-3 mt-4">
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-xl hover:bg-blue-600 transition"
            >
              Xác nhận & Mở Zalo
            </button>

            <button
              type="button"
              onClick={() => window.open("/qr-payment", "_blank")} // 👉 đường dẫn trang hiển thị mã QR
              className="w-full bg-green-500 text-white py-2 rounded-xl hover:bg-green-600 flex items-center justify-center gap-2 transition"
            >
              <QrCode size={18} />
              Thanh toán ngay bằng quét QR
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutModal;
