import { ArrowLeft } from "lucide-react";
import { formatCurrency } from "../../utils/formatCurrency";
import { Link, useParams } from "react-router-dom";

const OrderDetailPage = () => {
    const { id } = useParams();
    // read specific last order from localStorage
    let last: any = null;
    try {
        if (id) last = JSON.parse(localStorage.getItem(`lastOrder_${id}`) || "null");
    } catch (e) {
        last = null;
    }

    if (!last) {
        return (
            <div className="max-w-4xl mx-auto py-12 px-4">
                <h1 className="text-2xl font-semibold mb-4">Chi tiết đơn hàng</h1>
                <div className="p-6 bg-gray-400/10 rounded-lg shadow">
                    <p className="text-gray-600">Không tìm thấy đơn hàng này.</p>
                    <Link to="/" className="mt-4 inline-block text-blue-600">Quay về trang chủ</Link>
                </div>
            </div>
        );
    }

    const { orderId, createdAt, payload, items } = last;

    return (
        <div className="max-w-5xl mx-auto py-8 px-4">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-semibold">Chi tiết đơn hàng</h1>
                <div className="text-sm text-gray-500">Mã đơn: <span className="font-medium text-gray-800">{orderId}</span></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="md:col-span-2 bg-gray-300 p-4 rounded-lg shadow">
                    <h2 className="text-lg font-medium mb-3">Mặt hàng</h2>
                    <div className="space-y-3">
                        {Array.isArray(items) && items.length > 0 ? (
                            items.map((it: any, idx: number) => (
                                <div key={idx} className="flex items-start gap-4 border-b pb-3">
                                    <img src={it.image} alt={it.name} className="w-20 h-20 object-cover rounded" />
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <div className="font-medium text-gray-800">{it.name ?? it.food_id ?? 'Sản phẩm'}</div>
                                            <div className="text-right">
                                                <div className="text-sm text-red-500 font-semibold">{formatCurrency(Number(it.unit_price || it.price || 0))}</div>
                                                <div className="text-xs text-gray-600">x {it.quantity}</div>
                                            </div>
                                        </div>
                                        {it.variant_name && <div className="text-xs text-gray-500 mt-1">Biến thể: {it.variant_name}</div>}
                                        {it.options && it.options.length > 0 && (
                                            <div className="mt-2 flex items-center">
                                                <div className="text-xs text-gray-500">Tuỳ chọn:</div>
                                                <div className="text-xs text-gray-700 font-bold">
                                                    {it.options.map((o: any) => (
                                                        <div key={o.id} className="flex items-center justify-between">
                                                            <div className="text-xs">{o.name}</div>
                                                       
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-gray-500">Không có mặt hàng.</div>
                        )}
                    </div>
                </div>

                <aside className="bg-gray-300 p-4 rounded-lg shadow">
                    <h3 className="text-lg font-medium mb-3">Tổng quan</h3>
                    <div className="text-sm text-gray-600 mb-2">Ngày tạo: <div className="font-medium text-gray-800">{new Date(createdAt).toLocaleString()}</div></div>
                    <div className="text-sm text-gray-600 mb-2">Tổng tiền: <div className="font-semibold text-red-600">{formatCurrency(items?.reduce((s: number, i: any) => s + (Number(i.unit_price || i.price || 0) * (i.quantity || 1)), 0) + (payload?.shippingFee || 0))}</div></div>
                    <div className="text-sm text-gray-600">Phương thức thanh toán: <div className="font-medium text-gray-800">{payload?.payment_method || '---'}</div></div>
                </aside>
            </div>

            <div className="bg-gray-300 p-4 rounded-lg shadow">
                <h2 className="text-lg font-medium mb-3">Thông tin khách hàng & giao hàng</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <div className="text-sm text-gray-500">Người nhận</div>
                        <div className="font-medium">{payload?.customer_name}</div>
                        <div className="text-sm text-gray-500">SĐT</div>
                        <div className="font-medium">{payload?.customer_phone}</div>
                        {payload?.customer_email && (<>
                            <div className="text-sm text-gray-500 mt-2">Email</div>
                            <div className="font-medium">{payload?.customer_email}</div>
                        </>)}
                    </div>

                    <div>
                        <div className="text-sm text-gray-500">Địa chỉ</div>
                        <div className="font-medium">{payload?.address}</div>
                        {payload?.location_map && (
                            <div className="text-xs text-gray-500 mt-1">Vị trí trên bản đồ: <span className="text-gray-800">{payload.location_map}</span></div>
                        )}
                        {payload?.note && (
                            <div className="text-sm text-gray-500 mt-2">Ghi chú</div>
                        )}
                        {payload?.note && <div className="font-medium">{payload.note}</div>}
                    </div>
                </div>
            </div>

            <div className="mt-6">
                      
                <Link to="/" className="text-white rounded flex items-center p-2 bg-orange-400 "><ArrowLeft size={20} />Quay về trang chủ</Link>
            </div>
        </div>
    );
};

export default OrderDetailPage;
