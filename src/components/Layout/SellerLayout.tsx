import { NavLink, Outlet } from "react-router-dom";
import { useState } from "react";
import { Menu, X, List, UtensilsCrossed, ShoppingCart, Settings, Grid } from "lucide-react";
import logo from "../../assets/logo.jpg";
const SellerLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const navLinks = [
        { to: "/admin", label: "Dashboard", icon: <Grid size={18} /> },
        { to: "/admin/categories", label: "Danh mục", icon: <List size={18} /> },
        { to: "/admin/foods", label: "Món ăn", icon: <UtensilsCrossed size={18} /> },
        { to: "/admin/orders", label: "Đơn hàng", icon: <ShoppingCart size={18} /> },
        { to: "/admin/store", label: "Cấu hình quán", icon: <Settings size={18} /> },
    ];

    return (
        <div className="flex h-screen bg-gray-200">
            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-30 w-64 bg-gray-50 shadow-xl transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:static md:shadow-none`}
            >
                {/* Logo + Close button */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-300 bg-gray-100 shadow-lg shadow-gray-400/20">
                    <div className="flex items-center space-x-3">
                        <img
                            src={logo}
                            alt="Mèo Quán"
                            className="w-12 h-12 rounded-full object-cover border-2 border-gray-300"
                        />
                        <span className="font-extrabold text-lg text-gray-900">Mèo Quán Admin</span>
                    </div>
                    <button
                        className="md:hidden p-1 rounded hover:bg-gray-200"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <X size={20} />
                    </button>
                </div>


                {/* Menu */}
                <nav className="flex flex-col px-4 py-6 space-y-3 ">
                    {navLinks.map((link) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-gray-800 transition-colors ${isActive
                                    ? "bg-blue-600 text-white shadow-md"
                                    : "hover:bg-blue-100 hover:text-blue-700"
                                }`
                            }
                            onClick={() => setSidebarOpen(false)}
                        >
                            {link.icon}
                            <span>{link.label}</span>
                        </NavLink>
                    ))}
                </nav>
            </aside>

            {/* Overlay khi mobile */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-40 z-20 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <header className="flex p-6 items-center justify-between bg-white  border-gray-300">
                    {/* Hamburger button mobile */}
                    <button
                        className="md:hidden p-2 rounded hover:bg-gray-200"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <Menu size={24} />
                    </button>
                   <h1
  className="text-2xl font-bold text-gray-900 p-2"
  style={{ textShadow: "-2px 0 4px rgba(0,0,0,0.25)" }}
>
  Bảng điều khiển
</h1>

                    <div>{/* user menu, notifications */}</div>
                </header>

                {/* Content */}
                <main className="flex-1 overflow-auto p-6">
                    <div className="bg-white rounded-xl shadow-lg p-6 min-h-[80vh] border border-gray-300">
                        <Outlet />
                    </div>
                </main>
            </div>

        </div>
    );
};

export default SellerLayout;
