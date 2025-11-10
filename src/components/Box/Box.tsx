import { ArrowDown } from "lucide-react";
import logo from "../../assets/logo.jpg";
import { formatCurrency } from "../../utils/formatCurrency";
import { useState } from "react";
import ProductModal from "../ProductModal/ProductModal";

const Box = ({ data }: any) => {
  const [openModal, setOpenModal] = useState(false);

  return (
    <>
      <div className="relative bg-orange-100 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 cursor-pointer overflow-hidden w-full flex flex-col">
        <div className="h-44 w-full overflow-hidden bg-gray-100 flex items-center justify-center">
          <img
            src={data?.image ? data?.image : logo}
            alt={data?.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* discount badge top-right */}
        {(() => {
          const origin = Number(data?.origin_price ?? 0);
          const base = Number(data?.base_price ?? data?.price ?? 0);
          if (origin > 0 && origin > base) {
            const percent = Math.round(((origin - base) / origin) * 100);
            return (
              <div className="absolute top-3 right-3 bg-red-600 text-white text-sm font-bold px-2 py-1 rounded-md flex items-center gap-1 shadow-lg">
                <ArrowDown size={14} />
                <span>-{percent}%</span>
              </div>
            );
          }
          return null;
        })()}

        <div className="p-4 flex-1 flex flex-col justify-between">
          <div>
            <h1 className="text-lg font-semibold text-gray-800 truncate">{data?.name}</h1>
          
            <p className="text-sm text-gray-500 line-clamp-2 mt-1">{data?.description}</p>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <div>
              {data?.base_price || data?.price ? (
                <div className="text-lg text-red-600 font-bold">{formatCurrency(data?.base_price ?? data?.price)}</div>
              ) : (
                <div className="text-lg text-red-600 font-bold">{formatCurrency(data?.price)}</div>
              )}
                {/* origin price shown near the top with description (only when > base and > 0) */}
            {(() => {
              const origin = Number(data?.origin_price ?? 0);
              const base = Number(data?.base_price ?? data?.price ?? 0);
              if (origin > 0 && origin > base) {
                return (
                  <div >
                    <span className="text-sm text-gray-400 line-through">{formatCurrency(data?.origin_price)}</span>
                  </div>
                );
              }
              return null;
            })()}
            </div>

            <button
              className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
              onClick={() => setOpenModal(true)}
            >
              Thêm vào giỏ
            </button>
          </div>
        </div>
      </div>

      <ProductModal foodId={data?.id} isOpen={openModal} onClose={() => setOpenModal(false)} />
    </>
  );
};


export default Box;
