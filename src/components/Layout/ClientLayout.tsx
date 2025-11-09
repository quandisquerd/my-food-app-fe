import { useState } from "react";
import { House, Search, Settings, ShoppingCart, Menu, X } from "lucide-react";
import { Link, Outlet } from "react-router-dom";
import Cart from "../Cart/Cart";
import logo from "../../assets/logo.jpg";
import CartNotification from "../Cart/CartNotification";

const ClientLayout = () => {
    const [openMenu, setOpenMenu] = useState(false);

    return (
        <>
            <header className="p-5 bg-gray-700 text-white mb-5 flex items-center relative">
                <button
                    className="md:hidden p-2"
                    onClick={() => setOpenMenu(!openMenu)}
                >
                    {openMenu ? <X size={24} /> : <Menu size={24} />}
                </button>
                <Link to="/" className="hidden md:flex items-center gap-2 ml-2">
                    <img
                        src={logo}
                        alt="Logo quán"
                        className="h-10 w-auto rounded-lg select-none"
                    />
                </Link>


                {openMenu && (
                    <div
                        className="fixed inset-0 bg-black/40 z-40 md:hidden"
                        onClick={() => setOpenMenu(false)}
                    />
                )}

                <div
                    className={`
            fixed top-0 left-0 h-full w-2/3 max-w-xs bg-gray-800 text-white z-50
            transform transition-transform duration-300 ease-in-out
            ${openMenu ? "translate-x-0" : "-translate-x-full"}
            md:static md:translate-x-0 md:flex md:h-auto md:w-auto md:bg-transparent
          `}
                >
                    <div className="flex items-center gap-2 p-5 border-b border-gray-700 md:hidden">
                        <img src={logo} alt="Logo" className="h-10 w-auto rounded-lg" />
                        <span className="font-semibold text-lg">Meo Quán</span>
                    </div>

                    <ul className="flex flex-col md:flex-row list-none p-5 md:p-0">
                        <Link to="/" onClick={() => setOpenMenu(false)}>
                            <li className="flex items-center gap-2 py-2 md:px-5 whitespace-nowrap ">
                                <House /> Trang chủ
                            </li>
                        </Link>
                        <Link to="/cart" onClick={() => setOpenMenu(false)}>
                            <li className="flex items-center gap-2 py-2 md:px-5 whitespace-nowrap">
                                <ShoppingCart /> Đơn hàng
                            </li>
                        </Link>
                        <Link to="/setting" onClick={() => setOpenMenu(false)}>
                            <li className="flex items-center gap-2 py-2 md:px-5 whitespace-nowrap">
                                <Settings /> Cài đặt
                            </li>
                        </Link>
                    </ul>
                </div>

                <div className="ml-auto flex items-center gap-2">
                    <input
                        type="text"
                        className="border rounded-lg px-2 py-1 text-black"
                        placeholder="Tìm kiếm..."
                    />
                    <button className="p-2 bg-blue-500 text-white rounded-lg">
                        <Search />
                    </button>
                </div>
            </header>

            <Outlet />
            <Cart />
    <CartNotification />
            <footer className="p-4 text-center text-gray-500 text-sm">
                © Meo Quán - Tu Hoàng - Hà Nội
            </footer>
        </>
    );
};

export default ClientLayout;
