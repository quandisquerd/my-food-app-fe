import { createBrowserRouter } from "react-router-dom";
import MenuPage from "../pages/userPages/MenuPage";
import HomePage from "../pages/userPages/HomePage";
import OrderDetailPage from "../pages/userPages/OrderDetailPage";
import ClientLayout from "../components/Layout/ClientLayout";
import SellerLayout from "../components/Layout/SellerLayout";
import DashboardPage from "../pages/sellerPages/DashboadPage";


const routers = createBrowserRouter([
  {
    path: "/",
    element: <ClientLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "menu", element: <MenuPage /> },
      { path: "order/:id", element: <OrderDetailPage /> },
    ],
  },
  {
    path: "/admin",
    element: <SellerLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "menu", element: <MenuPage /> },
    ],
  }
])
export default routers