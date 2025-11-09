import { createBrowserRouter } from "react-router-dom";
import MenuPage from "../pages/userPages/MenuPage";
import HomePage from "../pages/userPages/HomePage";
import ClientLayout from "../components/Layout/ClientLayout";


const routers= createBrowserRouter([
    {
    path: "/",
    element: <ClientLayout />, 
    children: [
      { index: true, element: <HomePage /> }, 
      { path: "menu", element: <MenuPage /> }, 
    ],
  },
])
export default routers