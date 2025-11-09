import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { formatCurrency } from "../../utils/formatCurrency";
import { generateVietQR } from "../../utils/generateQR";


interface CheckoutProps {
    isOpen: boolean;
    onClose: () => void;
    totalAmount: number;
}

const Checkout = ({ isOpen, onClose, totalAmount }: CheckoutProps) => {
    const [qrUrl, setQrUrl] = useState("");
    const accountNumber = "1021697711"; // 💳 Số tài khoản Timo (OCB)
    const accountName = "PHAM DUC HOANG";    // 🧾 Tên chủ tài khoản

    useEffect(() => {
        if (isOpen) {
            const qr = generateVietQR(
                accountNumber,
                totalAmount,
                `Thanh toan don hang MEO QUAN ${Date.now()}`
            );
            setQrUrl(qr);
        }
    }, [isOpen, totalAmount]);
    console.log(qrUrl);


    if (!isOpen) return null;

    return (
        <>
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-black bg-opacity-40 z-40"
                onClick={onClose}
            ></div>

            {/* Modal */}
            <div className="fixed top-1/2 left-1/2 z-50 w-[90%] sm:w-[400px] -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-xl p-6">
                <div className="flex justify-between items-center mb-4 border-b pb-2">
                    <h2 className="text-lg font-semibold text-gray-800">Thanh toán</h2>
                    <button onClick={onClose}>
                        <X className="text-gray-500 hover:text-black" />
                    </button>
                </div>

                <div className="text-center space-y-3">
                    <h3 className="font-semibold text-gray-700">
                        Tổng thanh toán: <span className="text-red-500">{formatCurrency(totalAmount)}</span>
                    </h3>
                    <p className="text-sm text-gray-500">
                        Quét mã QR bên dưới bằng ứng dụng ngân hàng hoặc ZaloPay để thanh toán
                    </p>

                    {qrUrl ? (
                        <img
                            src={qrUrl}
                            alt="QR Thanh toán"
                            className="w-48 h-48 mx-auto mb-3 border rounded-lg"
                        />
                    ) : (
                        <p className="text-gray-500 text-sm">Đang tải mã QR...</p>
                    )}


                    <div className="text-center mt-3">
                        <p className="font-medium">{accountName}</p>
                        <p className="text-gray-500 text-sm">{accountNumber} (Timo - OCB)</p>
                    </div>

                    <button
                        className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition-all"
                        onClick={() => alert("Cảm ơn bạn! Hãy hoàn tất chuyển khoản.")}
                    >
                        ✅ Đã thanh toán
                    </button>
                </div>
            </div>
        </>
    );
};

export default Checkout;
