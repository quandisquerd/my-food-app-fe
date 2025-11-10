import { X, RefreshCw, Trash2 } from "lucide-react";
import { formatCurrency } from "../../utils/formatCurrency";
import { useState, useEffect } from "react";
import { useGetLocationShipQuery } from "../../service/ClientService";
import Checkout from "../Cart/Checkout";

interface CheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    totalAmount: number;
    shopLocation?: { lat: number; lon: number };
    onSubmit: (data: {
        name: string;
        phone: string;
        detectedLocation?: string;
        detailAddress?: string;
        distanceKm?: number;
        shippingFee?: number;
        note?: string;
        // new: payment method chosen by user: 'cash' | 'qr'
        paymentMethod?: 'cash' | 'qr';
        // coordinates
        addressLat?: number;
        addressLong?: number;
    }) => Promise<any>;
}

const CheckoutModal = ({ isOpen, onClose, onSubmit, totalAmount, shopLocation }: CheckoutModalProps) => {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [detailAddress, setDetailAddress] = useState("");
    const [note, setNote] = useState("");
    const [detectedLocation, setDetectedLocation] = useState<string | undefined>(undefined);
    const [loadingLocation, setLoadingLocation] = useState(false);
    const [userLat, setUserLat] = useState<number | undefined>(undefined);
    const [userLon, setUserLon] = useState<number | undefined>(undefined);
    const [distanceKmState, setDistanceKmState] = useState<number | undefined>(undefined);
    const [shippingFeeState, setShippingFeeState] = useState<number | undefined>(undefined);
    const [paymentMethod, setPaymentMethod] = useState<'cash' | 'qr'>('cash');
    const [showQrModal, setShowQrModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // When modal closes, reset internal form state so values from previous order are not remembered
    useEffect(() => {
        if (!isOpen) {
            setName("");
            setPhone("");
            setDetailAddress("");
            setNote("");
            setDetectedLocation(undefined);
            setUserLat(undefined);
            setUserLon(undefined);
            setDistanceKmState(undefined);
            setShippingFeeState(undefined);
            setPaymentMethod('cash');
            setShowQrModal(false);
        }
    }, [isOpen]);

    // Auto-fetch user location when modal opens (so user doesn't have to press the button)
    useEffect(() => {
        if (!isOpen) return;
        // If we already have a detected location and coords, skip auto-fetch to avoid prompting repeatedly
        if (detectedLocation || (userLat !== undefined && userLon !== undefined)) return;
        // call and ignore result
        getLocationByIP();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    // Reverse geocode lat/lon to a readable address using OpenStreetMap Nominatim
    const reverseGeocode = async (lat: number, lon: number) => {
        try {
            const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}&addressdetails=1&accept-language=vi`;
            const res = await fetch(url, {
                headers: {
                    // Nominatim asks for a valid User-Agent or Referer; browser will send Referer.
                    "Content-Type": "application/json"
                }
            });
            if (!res.ok) throw new Error("Reverse geocode failed");
            const json = await res.json();
            const addr = json.address || {};

            // Build a friendly address string with house/road, neighbourhood/suburb, district, city, state
            const parts: string[] = [];
            const house = addr.house_number || addr.house || "";
            const road = addr.road || addr.pedestrian || addr.cycleway || addr.footway || "";
            if (house && road) parts.push(`${house} ${road}`);
            else if (road) parts.push(road);
            else if (house) parts.push(house);

            const neighbourhood = addr.neighbourhood || addr.suburb || addr.village || addr.hamlet || "";
            if (neighbourhood) parts.push(neighbourhood);

            // district/county
            const district = addr.city_district || addr.county || addr.district || "";
            if (district) parts.push(district);

            // city / town
            const city = addr.city || addr.town || addr.village || "";
            if (city && city !== district) parts.push(city);

            const state = addr.state || "";
            if (state) parts.push(state);

            const country = addr.country || "";
            if (country) parts.push(country);

            const formatted = parts.filter(Boolean).join(", ");
            return formatted || `${lat.toFixed(5)}, ${lon.toFixed(5)}`;
        } catch (e) {
            return `${lat.toFixed(5)}, ${lon.toFixed(5)}`;
        }
    };

    const getLocationByIP = async () => {
        try {
            setLoadingLocation(true);
            // First try browser geolocation
            if (navigator.geolocation) {
                await new Promise<void>((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(
                        async (pos) => {
                            const { latitude, longitude } = pos.coords;
                            // store coords
                            setUserLat(latitude);
                            setUserLon(longitude);
                            // Try to reverse geocode for a detailed address
                            const formatted = await reverseGeocode(latitude, longitude);
                            setDetectedLocation(formatted);
                            resolve();
                        },
                        () => reject(),
                        { timeout: 8000 }
                    );
                }).catch(async () => {
                    // fallback to IP-based lookup; try to use ip-derived coords for reverse geocode
                    const res = await fetch("https://ipapi.co/json/");
                    const json = await res.json();
                    const lat = parseFloat(json.latitude);
                    const lon = parseFloat(json.longitude);
                    if (!isNaN(lat) && !isNaN(lon)) {
                        setUserLat(lat);
                        setUserLon(lon);
                        const formatted = await reverseGeocode(lat, lon);
                        setDetectedLocation(formatted || `${json.city || ""}${json.region ? ", " + json.region : ""}${json.country_name ? ", " + json.country_name : ""}`);
                    } else {
                        const loc = `${json.city || ""}${json.region ? ", " + json.region : ""}${json.country_name ? ", " + json.country_name : ""}`;
                        setDetectedLocation(loc || "Vị trí không xác định");
                    }
                });
            } else {
                // fallback to IP
                const res = await fetch("https://ipapi.co/json/");
                const json = await res.json();
                const lat = parseFloat(json.latitude);
                const lon = parseFloat(json.longitude);
                if (!isNaN(lat) && !isNaN(lon)) {
                    setUserLat(lat);
                    setUserLon(lon);
                    const formatted = await reverseGeocode(lat, lon);
                    setDetectedLocation(formatted || `${json.city || ""}${json.region ? ", " + json.region : ""}${json.country_name ? ", " + json.country_name : ""}`);
                } else {
                    const loc = `${json.city || ""}${json.region ? ", " + json.region : ""}${json.country_name ? ", " + json.country_name : ""}`;
                    setDetectedLocation(loc || "Vị trí không xác định");
                }
            }
        } catch (err) {
            try {
                const res = await fetch("https://ipapi.co/json/");
                const json = await res.json();
                const lat = parseFloat(json.latitude);
                const lon = parseFloat(json.longitude);
                if (!isNaN(lat) && !isNaN(lon)) {
                    setUserLat(lat);
                    setUserLon(lon);
                    const formatted = await reverseGeocode(lat, lon);
                    setDetectedLocation(formatted || `${json.city || ""}${json.region ? ", " + json.region : ""}${json.country_name ? ", " + json.country_name : ""}`);
                } else {
                    const loc = `${json.city || ""}${json.region ? ", " + json.region : ""}${json.country_name ? ", " + json.country_name : ""}`;
                    setDetectedLocation(loc || "Vị trí không xác định");
                }
            } catch (e) {
                setDetectedLocation("Không thể lấy vị trí");
            }
        } finally {
            setLoadingLocation(false);
        }
    };

    // Haversine distance in kilometers
    const computeDistanceKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
        const toRad = (deg: number) => (deg * Math.PI) / 180;
        const R = 6371; // earth km
        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    // We rely on backend to calculate distance and shipping fee. Do not use local calculation.

    // Call backend shipping API when we have user coords
    const { data: shipData, isLoading: shipLoading, error: shipError } = useGetLocationShipQuery(
        userLat && userLon ? { lat: userLat, lng: userLon } : (undefined as any),
        { skip: !userLat || !userLon }
    );

    // Normalize backend payload (handle wrappers like { data: {...} })
    const shipPayload = shipData && typeof shipData === 'object'
        ? (shipData.data ?? shipData.result ?? shipData.payload ?? shipData)
        : shipData;

    // Parse backend response into distanceKmState and shippingFeeState (use normalized shipPayload)
    useEffect(() => {
        if (!shipPayload) return;
        // Robust parsing: prefer explicit distance_km or numeric fields; then parse string like "6m" or "0.5km"
        let dNum: number | undefined = undefined;
        // check common numeric fields first on shipPayload (handles wrappers like { data: {...} })
        if (shipPayload && typeof shipPayload === 'object') {
            if (shipPayload.distance_km !== undefined && !isNaN(Number(shipPayload.distance_km))) {
                dNum = Number(shipPayload.distance_km);
            } else if (shipPayload.distanceKm !== undefined && !isNaN(Number(shipPayload.distanceKm))) {
                dNum = Number(shipPayload.distanceKm);
            } else if (shipPayload.km !== undefined && !isNaN(Number(shipPayload.km))) {
                dNum = Number(shipPayload.km);
            } else if (shipPayload.distance !== undefined) {
                // distance may be a string like "6m" or "0.5km"
                const raw = String(shipPayload.distance).trim();
                const mMatch = raw.match(/^([0-9,.]+)\s*m(?:eters?)?$/i);
                const kmMatch = raw.match(/^([0-9,.]+)\s*km$/i);
                const numMatch = raw.match(/([0-9,.]+)/);
                if (kmMatch) {
                    dNum = Number(kmMatch[1].replace(/,/g, ''));
                } else if (mMatch) {
                    dNum = Number(mMatch[1].replace(/,/g, '')) / 1000;
                } else if (numMatch) {
                    // ambiguous number, assume meters if small (<10) and contains 'm' not 'km'
                    const parsed = Number(numMatch[1].replace(/,/g, ''));
                    if (raw.toLowerCase().includes('m') && !raw.toLowerCase().includes('km')) {
                        dNum = parsed / 1000;
                    } else {
                        dNum = parsed;
                    }
                }
            }
        }

        // shipping fee parse (allow 0) from shipPayload
        let fNum: number | undefined = undefined;
        if (shipPayload && typeof shipPayload === 'object') {
            const candidates = ['shipping_fee', 'shippingFee', 'fee', 'price', 'ship_price'];
            for (const key of candidates) {
                if (shipPayload[key] !== undefined && !isNaN(Number(shipPayload[key]))) {
                    fNum = Number(shipPayload[key]);
                    break;
                }
            }
            // also check top-level 'shipping' style
            if (fNum === undefined && shipPayload.shipping !== undefined && !isNaN(Number(shipPayload.shipping))) {
                fNum = Number(shipPayload.shipping);
            }
        }

        if (typeof dNum === "number" && !isNaN(dNum)) setDistanceKmState(dNum);
        if (typeof fNum === "number" && !isNaN(fNum)) setShippingFeeState(fNum);
        // For convenience, if detectedLocation is empty and payload has an address-like field, set it
        try {
            const addr = shipPayload.address || shipPayload.location || shipPayload.place;
            if (!detectedLocation && typeof addr === 'string' && addr.trim()) setDetectedLocation(addr);
        } catch (e) { }
    }, [shipPayload]);

    // Use only backend values (backend already provides distance and shipping fee)
    const distanceKm = distanceKmState;
    const shippingFee = shippingFeeState;

    // Display string for distance: prefer raw backend string (e.g. "6m"), otherwise numeric distance_km -> "x km".
    const displayDistanceStr = shipPayload
        ? (shipPayload.distance ?? (shipPayload.distance_km !== undefined ? `${Number(shipPayload.distance_km)} km` : undefined))
        : undefined;

    const handleSubmit = async () => {
        if (!name.trim() || !phone.trim()) return;
        setIsSubmitting(true);
        try {
            await onSubmit({
                name: name.trim(),
                phone: phone.trim(),
                detectedLocation,
                detailAddress: detailAddress.trim(),
                distanceKm: distanceKm ? Number(distanceKm.toFixed(2)) : undefined,
                shippingFee,
                note: note.trim() || undefined,
                paymentMethod,
                // include coordinates if available
                addressLat: userLat,
                addressLong: userLon
            });
        } catch (e) {
            console.error('checkout submit failed', e);
        } finally {
            setIsSubmitting(false);
        }
    };

    // When user selects QR payment, open the QR checkout modal to show QR to scan.
    const onSelectPayment = (pm: 'cash' | 'qr') => {
        setPaymentMethod(pm);
        if (pm === 'qr') {
            // open QR checkout modal immediately so user can scan
            setShowQrModal(true);
        } else {
            setShowQrModal(false);
        }
    };

    // Always call hooks above; only return null (no render) after hooks to avoid conditional hooks error
    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-40 z-40" onClick={onClose} />

            <div className="fixed top-1/2 left-1/2 z-50 w-[95%] sm:w-[720px] md:w-[900px] max-w-[1100px] -translate-x-1/2 -translate-y-1/2  rounded-2xl shadow-xl p-6 bg-white">
                <div className="flex justify-between items-center mb-4 border-b pb-2">
                    <h2 className="text-lg font-semibold text-gray-800">Thông tin giao hàng</h2>
                    <button onClick={onClose}>
                        <X className="text-gray-500 hover:text-black" />
                    </button>
                </div>

                {/* Header summary removed — order total and distance moved to bottom with shipping */}

                <div className="space-y-3">
                    <div>
                        <label className="text-sm">Họ và tên</label>
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full mt-1 p-3 border rounded text-base"
                            disabled={isSubmitting}
                            placeholder="Nguyễn Văn A"
                        />
                    </div>

                    <div>
                        <label className="text-sm">Số điện thoại</label>
                        <input
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full mt-1 p-3 border rounded text-base"
                            disabled={isSubmitting}
                            placeholder="09xxxxxxxx"
                            inputMode="tel"
                        />
                    </div>

                    <div>
                        <label className="text-sm">Vị trí hiện tại (gần đúng)</label>
                        <div className="flex gap-2 mt-1 items-center">
                            <input
                                value={detectedLocation ?? ""}
                                readOnly
                                className="flex-1 p-3 border rounded bg-gray-50 text-base"
                                disabled={isSubmitting}
                                placeholder="Chưa có vị trí"
                            />

                            {/* If we have a detected location, hide the primary 'Lấy vị trí' button
                                    and show icon buttons to clear or re-fetch. Otherwise show the primary button. */}
                            {detectedLocation ? (
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => getLocationByIP()}
                                        title="Lấy lại vị trí"
                                        className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center justify-center"
                                        disabled={loadingLocation}
                                    >
                                        <RefreshCw size={16} />
                                    </button>
                                    <button
                                        onClick={() => {
                                            setDetectedLocation(undefined);
                                            setUserLat(undefined);
                                            setUserLon(undefined);
                                            setDistanceKmState(undefined);
                                            setShippingFeeState(undefined);
                                        }}
                                        title="Xóa vị trí"
                                        className="p-2 bg-red-500 text-white rounded hover:bg-red-600 flex items-center justify-center"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={getLocationByIP}
                                    className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                    disabled={loadingLocation || isSubmitting}
                                >
                                    {loadingLocation ? "Đang lấy..." : "Lấy vị trí"}
                                </button>
                            )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Sử dụng vị trí máy hoặc ước lượng từ IP.</p>
                    </div>

                    <div>
                        <label className="text-sm">Địa chỉ cụ thể (số nhà, ngõ, phường...)</label>
                        <input
                            value={detailAddress}
                            onChange={(e) => setDetailAddress(e.target.value)}
                            className="w-full mt-1 p-3 border rounded text-base"
                            disabled={isSubmitting}
                            placeholder="Ví dụ: Số 12, ngõ 34, đường ABC, Phường XYZ"
                        />
                    </div>

                    <div>
                        <label className="text-sm">Ghi chú đơn hàng (tuỳ chọn)</label>
                        <textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            className="w-full mt-1 p-3 border rounded text-base resize-y min-h-[64px]"
                            disabled={isSubmitting}
                            placeholder="Ghi chú đơn hàng, ví dụ: không hành, để ngoài cửa..."
                        />
                    </div>

                    {/* Order summary: total, distance, shipping fee and grand total (moved to bottom) */}
                    <div className="mt-4 border-t pt-3 space-y-2">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-600">Tổng đơn hàng</div>
                            <div className="text-lg font-semibold text-red-500">{formatCurrency(totalAmount)}</div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-600">Khoảng cách</div>
                            <div className="text-sm text-gray-700">
                                {shipLoading ? (
                                    <span className="text-sm text-gray-500">Đang tính...</span>
                                ) : shipPayload ? (
                                    shipPayload.distance ?? (shipPayload.distance_km !== undefined ? `${Number(shipPayload.distance_km)} km` : "Chưa có vị trí")
                                ) : (
                                    distanceKm !== undefined ? `${distanceKm.toFixed(2)} km` : "Chưa có vị trí"
                                )}
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-600">Phí vận chuyển</div>
                            <div className="text-sm text-gray-800 font-medium">
                                {shipLoading ? (
                                    <span className="text-sm text-gray-500">Đang tính phí...</span>
                                ) : shipError ? (
                                    <span className="text-sm text-red-500">Không tính được phí</span>
                                ) : shipPayload ? (
                                    (() => {
                                        const f = shipPayload.shipping_fee ?? shipPayload.shippingFee ?? shipPayload.fee ?? shipPayload.price ?? shipPayload.ship_price ?? shipPayload.shipping;
                                        return typeof f === 'number' || (typeof f === 'string' && !isNaN(Number(f))) ? formatCurrency(Number(f)) : (shippingFee !== undefined ? formatCurrency(shippingFee) : "—");
                                    })()
                                ) : shippingFee !== undefined ? (
                                    formatCurrency(shippingFee)
                                ) : (
                                    "—"
                                )}
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-700">Tổng (đã gồm ship)</div>
                            <div className="text-lg font-semibold text-red-600">{shippingFee !== undefined ? formatCurrency(totalAmount + (shippingFee || 0)) : formatCurrency(totalAmount)}</div>
                        </div>
                    </div>

                    <div className="mt-4">
                        <div className="text-sm text-gray-700 mb-2">Phương thức thanh toán</div>
                        <div className="flex gap-4 items-center mb-3">
                            <label className={`flex items-center gap-2 p-2 border rounded ${paymentMethod === 'cash' ? 'ring-2 ring-blue-200' : ''}`}>
                                <input type="radio" name="payment" checked={paymentMethod === 'cash'} onChange={() => onSelectPayment('cash')} disabled={isSubmitting} />
                                <span className="ml-1">Tiền mặt</span>
                            </label>

                            <label className={`flex items-center gap-2 p-2 border rounded ${paymentMethod === 'qr' ? 'ring-2 ring-blue-200' : ''}`}>
                                <input type="radio" name="payment" checked={paymentMethod === 'qr'} onChange={() => onSelectPayment('qr')} disabled={isSubmitting} />
                                <span className="ml-1">Quét QR</span>
                            </label>
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                            <button onClick={onClose} className="px-4 py-2 rounded border" disabled={isSubmitting}>
                                Huỷ
                            </button>
                            <button
                                onClick={() => {
                                    if (paymentMethod === 'cash') handleSubmit();
                                    else setShowQrModal(true);
                                }}
                                className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-60 flex items-center justify-center gap-2"
                                disabled={
                                    isSubmitting ||
                                    !name.trim() ||
                                    !phone.trim() ||
                                    !detailAddress.trim() ||
                                    !detectedLocation
                                }
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                                        </svg>
                                        <span>Đang xử lý...</span>
                                    </>
                                ) : (
                                    (paymentMethod === 'cash' ? 'Đặt hàng' : 'Tiếp tục')
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {/* If user selected QR, render the QR checkout modal for scanning */}
            <Checkout isOpen={showQrModal} onClose={() => setShowQrModal(false)} totalAmount={totalAmount} onPaid={async () => {
                // User indicates they've paid via QR; submit checkout with paymentMethod=qr
                setIsSubmitting(true);
                try {
                    await onSubmit({
                        name: name.trim(),
                        phone: phone.trim(),
                        detectedLocation,
                        detailAddress: detailAddress.trim(),
                        distanceKm: distanceKm ? Number(distanceKm.toFixed(2)) : undefined,
                        shippingFee,
                        note: note.trim() || undefined,
                        paymentMethod: 'qr',
                        addressLat: userLat,
                        addressLong: userLon
                    });
                } catch (e) {
                    console.error('QR checkout submit failed', e);
                } finally {
                    setIsSubmitting(false);
                    setShowQrModal(false);
                }
            }} />
        </>
    );
};

export default CheckoutModal;
