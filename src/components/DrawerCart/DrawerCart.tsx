import { X, Plus, Minus } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { formatCurrency } from "../../utils/formatCurrency";
import Checkout from "../Cart/Checkout";
import CheckoutModal from "./CheckoutModal";
import { useCreateOrderMutation, useCreateOrderItemsBulkMutation } from "../../service/ClientService";

interface DrawerCartProps {
  isOpen: boolean;
  onClose: () => void;
}

const DrawerCart = ({ isOpen, onClose }: DrawerCartProps) => {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  // Default shop location (latitude, longitude). Update to your shop's coordinates as needed.
  const shopLocation = { lat: 21.0277644, lon: 105.8341598 };
  // Lấy dữ liệu từ localStorage
  const loadCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartItems(cart);
  };

  useEffect(() => {
    if (isOpen) loadCart();
  }, [isOpen]);

  useEffect(() => {
    const onCartUpdated = () => loadCart();
    window.addEventListener('cartUpdated', onCartUpdated);
    return () => window.removeEventListener('cartUpdated', onCartUpdated);
  }, []);

  // Cập nhật lại cart trong localStorage
  const updateCart = (newCart: any[]) => {
    localStorage.setItem("cart", JSON.stringify(newCart));
    setCartItems(newCart);
    window.dispatchEvent(new Event("cartUpdated"));
  };

  // Helper to compute composite key for an item
  const itemKey = (item: any) => {
    const opts = (item.options || []).map((o: any) => o.id).sort().join(',')
    return `${item.id}::v:${item.variant?.id ?? ''}::o:${opts}`
  }

  // Tăng số lượng bằng composite key
  const handleIncrease = (key: string) => {
    const updatedCart = cartItems.map((item) =>
      itemKey(item) === key ? { ...item, quantity: (item.quantity || 0) + 1 } : item
    );
    updateCart(updatedCart);
  };

  // Giảm số lượng (và confirm xoá nếu = 1) bằng composite key
  const handleDecrease = (key: string) => {
    const item = cartItems.find((i) => itemKey(i) === key);
    if (!item) return;

    if ((item.quantity || 0) <= 1) {
      const confirmDelete = window.confirm(
        `Bạn có chắc muốn xoá "${item.name}" khỏi giỏ hàng không?`
      );
      if (!confirmDelete) return;

      const updatedCart = cartItems.filter((i) => itemKey(i) !== key);
      updateCart(updatedCart);
    } else {
      const updatedCart = cartItems.map((i) =>
        itemKey(i) === key ? { ...i, quantity: (i.quantity || 0) - 1 } : i
      );
      updateCart(updatedCart);
    }
  };
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const [createOrder] = useCreateOrderMutation();
  const [createOrderItemsBulk] = useCreateOrderItemsBulkMutation();
  const navigate = useNavigate();
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
                key={itemKey(item)}
                className="flex items-center justify-between bg-white p-3 rounded-lg shadow-md ring-1 ring-gray-100"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-12 h-12 object-cover rounded"
                />
                <div className="flex-1 ml-3 text-left">
                  <h3 className="text-sm font-semibold">{item.name}</h3>
                  {item.variant?.name && (
                    <div className="text-xs text-gray-500">{item.variant.name}</div>
                  )}
                  {item.options?.length > 0 && (
                    <div className="text-xs text-gray-500 mt-1">
                      {item.options.map((o: any) => (
                        <div key={o.id} className="flex items-center gap-2">
                          <span className="truncate">{o.name}</span>
                          <span className="text-red-500">+{formatCurrency(o.extra_price)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {item.origin_price ? (
                    <div className=" items-baseline">
                      <p className="text-xs text-gray-400 line-through">{formatCurrency(item.origin_price)}</p>
                      <p className="text-sm text-red-600 font-bold">{formatCurrency(item.price)}</p>
                    </div>
                  ) : (
                    <p className="text-sm text-red-600 font-bold">{formatCurrency(item.price)}</p>
                  )}
                  {/* Nút tăng/giảm */}
                  <div className="flex items-center gap-2 mt-1">
                    <button
                      onClick={() => handleDecrease(itemKey(item))}
                      className="p-1 bg-gray-300 rounded hover:bg-gray-400"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="text-sm font-medium">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleIncrease(itemKey(item))}
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
          {cartItems?.length > 0 && (
            <div className="mb-2 text-right  text-xl text-red-500 font-bold">
              Tổng tiền: {formatCurrency(totalPrice)}
            </div>
          )}

          <button
            disabled={cartItems?.length <= 0 ? true : false}
            className={`w-full ${cartItems?.length > 0 ? "bg-blue-500" : "bg-gray-600"}  text-white py-2 rounded-lg ${cartItems?.length > 0 ? "hover:bg-blue-600" : "hover:bg-gray-600"}   mb-5`}
            onClick={() => {
              // Close the drawer and open checkout modal
              onClose();
              setShowDetailsModal(true);
            }}
          >
            🛒 Thanh toán
          </button>
        </div>
      </div>
      {/* Modal for entering shipping info (name, phone, address, get location) */}
      <CheckoutModal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        totalAmount={totalPrice}
        shopLocation={shopLocation}
        onSubmit={async (data) => {
          // Save checkout details locally first
          try {
            localStorage.setItem("checkoutDetails", JSON.stringify(data));
          } catch (e) {
            console.warn("Cannot save checkout details", e);
          }
          // If we have coordinates, reverse geocode to a human readable map location
          const reverseGeocode = async (lat: number | null | undefined, lon: number | null | undefined) => {
            if (lat == null || lon == null) return null;
            try {
              const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}&addressdetails=1&accept-language=vi`;
              const res = await fetch(url, { headers: { 'Content-Type': 'application/json' } });
              if (!res.ok) return null;
              const json = await res.json();
              const addr = json.address || {};
              const parts: string[] = [];
              const house = addr.house_number || addr.house || '';
              const road = addr.road || addr.pedestrian || '';
              if (house && road) parts.push(`${house} ${road}`);
              else if (road) parts.push(road);
              else if (house) parts.push(house);
              const neighbourhood = addr.neighbourhood || addr.suburb || addr.village || '';
              if (neighbourhood) parts.push(neighbourhood);
              const district = addr.city_district || addr.county || addr.district || '';
              if (district) parts.push(district);
              const city = addr.city || addr.town || addr.village || '';
              if (city && city !== district) parts.push(city);
              const state = addr.state || '';
              if (state) parts.push(state);
              const country = addr.country || '';
              if (country) parts.push(country);
              const formatted = parts.filter(Boolean).join(', ');
              return formatted || `${lat.toFixed(5)}, ${lon.toFixed(5)}`;
            } catch (e) {
              return null;
            }
          };

          const location_map = await reverseGeocode((data as any).addressLat, (data as any).addressLong);

          // Build order payload expected by backend
          const orderPayload = {
            customer_id: null,
            customer_name: data.name,
            customer_phone: data.phone,
            customer_email: (data as any).email || null,
            address: data.detailAddress || data.detectedLocation || "",
            address_lat: (data as any).addressLat ?? null,
            address_long: (data as any).addressLong ?? null,
            // include human readable map address for local view
            location_map: location_map ?? null,
            total_price: Math.round((totalPrice + (data.shippingFee || 0)) || 0),
            payment_method: data.paymentMethod === 'cash' ? 'COD' : 'BankTransfer',
            note: data.note || ""
          };

          // Helper to build items payload
          const items = cartItems.map((item) => ({
            food_id: String(item.id),
            variant_id: item.variant?.id ?? null,
            options: (item.options || []).map((o: any) => ({ id: o.id, name: o.name, extra_price: o.extra_price })),
            quantity: item.quantity,
            unit_price: Math.round(Number(item.price) || 0)
          }));

          try {
            // create order via RTK mutation
            const createOrderResult = await createOrder(orderPayload).unwrap();
            const orderId = createOrderResult?.id ?? createOrderResult?.order_id ?? createOrderResult?.data?.id ?? createOrderResult?.data?.order_id;
            if (!orderId) throw new Error('No order id returned from server');

            // prepare two payloads: one for API (no images/names) and one for local storage (with images/names)
            const itemsForApi = cartItems.map((item) => ({
              food_id: String(item.id),
              variant_id: item.variant?.id ?? null,
              options: (item.options || []).map((o: any) => ({ id: o.id, name: o.name, extra_price: o.extra_price })),
              quantity: item.quantity,
              unit_price: Math.round(Number(item.price) || 0)
            }));

            const itemsForLocal = cartItems.map((item) => ({
              food_id: String(item.id),
              name: item.name,
              image: item.image,
              variant_id: item.variant?.id ?? null,
              variant_name: item.variant?.name ?? null,
              options: (item.options || []).map((o: any) => ({ id: o.id, name: o.name, extra_price: o.extra_price })),
              quantity: item.quantity,
              unit_price: Math.round(Number(item.price) || 0)
            }));

            // create order items in bulk via RTK mutation using API payload
            await createOrderItemsBulk({ order_id: String(orderId), items: itemsForApi }).unwrap();

            // Success: clear cart and store order id locally for status viewing
            localStorage.removeItem('cart');
            setCartItems([]);
            // notify other components (cart icon/count) that cart changed
            window.dispatchEvent(new Event('cartUpdated'));
            try {
              // save under order-specific key so detail page can load exact order
              localStorage.setItem(`lastOrder_${orderId}`, JSON.stringify({ orderId: String(orderId), createdAt: new Date().toISOString(), payload: orderPayload, items: itemsForLocal }));
            } catch (e) { /* ignore */ }

            // Close any modals and notify user
            setShowDetailsModal(false);
            setShowCheckout(false);
            // alert(`Đặt hàng thành công. Mã đơn: ${orderId}`);
            // navigate to order detail page for the newly created order
            try { navigate(`/order/${orderId}`); } catch (e) { /* ignore */ }
          } catch (err: any) {
            console.error('Order creation failed', err);
            alert('Đặt hàng thất bại: ' + (err?.message || err));
          }
        }}
      />

      <Checkout isOpen={showCheckout} totalAmount={totalPrice} onClose={() => setShowCheckout(false)} />

    </>
  );
};

export default DrawerCart;
