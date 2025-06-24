import { BrowserRouter as Router, Routes, Route, Outlet, Navigate, useLocation } from "react-router-dom";

//Admin Routes
import Admin from "./pages/layouts/AdminLayout";
import Dashboard from "./pages/Dashboard";
import ManageInventory from "./pages/ManageInventory";
import ManageOrders from "./pages/ManageOrders";
import ManageSales from "./pages/ManageSales";
import ManageUsers from "./pages/ManageUsers";
import Settings from "./pages/Settings";

//Customer Routes
import Main from "./pages//layouts/MainLayout";
import Products from "./pages/Products";
import Home from "./pages/Home";

import Login from "./pages/Login";
import Register from "./pages/Register";


const PrivateRoute = () => {
  const role = sessionStorage.getItem("role");
  sessionStorage.setItem("isAuthenticated", true);
  // if (role == "customer") {
  //   return <Navigate to="/" />;
  // }
  const token = sessionStorage.getItem("isAuthenticated");
  return token ? <Outlet /> : <Navigate to="/" />;
};

export default function App() {
  return (
     <Router>
      <Routes>
          <Route path="/" element={<Main />}>
            <Route index element={<Home />} />
            <Route path="products" element={<Products />} />
          </Route>


        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Admin />}>
            <Route index element={<Dashboard />} />
            <Route path="manage-inventory" element={<ManageInventory />} />
            <Route path="manage-orders" element={<ManageOrders />} />
            <Route path="manage-sales" element={<ManageSales />} />
            <Route path="manage-users" element={<ManageUsers />} />
            <Route path="settings" element={<Settings />} />
            
          </Route>
        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Redirect any unmatched routes to the home page */}

      </Routes>
    </Router>
  );
}