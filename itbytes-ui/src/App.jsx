import { BrowserRouter as Router, Routes, Route, Outlet, Navigate, useLocation } from "react-router-dom";

//Admin Routes
import Admin from "./layouts/AdminLayout";
import Dashboard from "./pages/Dashboard";
import ManageInventory from "./pages/ManageInventory";
import ManageOrders from "./pages/ManageOrders";
import ManageUsers from "./pages/ManageUsers";
import Settings from "./pages/Settings";
import BuySupplies from "./pages/BuySupplies";

//Customer Routes
import Main from "./layouts/MainLayout";
import Products from "./pages/Products";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Order from "./pages/Order";
import Test from "./pages/Test";

import Login from "./pages/Login";
import Register from "./pages/Register";


const PrivateRoute = () => {
  const role = sessionStorage.getItem("role");
  sessionStorage.setItem("isAuthenticated", true);
  if (role == "customer") {
    return <Navigate to="/" />;
  }
  const token = sessionStorage.getItem("isAuthenticated");
  return token ? <Outlet /> : <Navigate to="/" />;
};

const RoleRoute = ({ allowedRoles, children }) => {
  const isAuthenticated = sessionStorage.getItem("isAuthenticated") === "true";
  const role = sessionStorage.getItem("role");

  if (!isAuthenticated) return <Navigate to="/login" />;
  if (!allowedRoles.includes(role)) return <Navigate to="/" />;

  return children;
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />}>
          <Route index element={<Home />} />
          <Route path="products" element={<Products />} />
          <Route path="cart" element={<Cart />} />
          <Route path="orders" element={<Order />} />
        </Route>


        <Route path="/dashboard" element={<Admin />}>
          <Route
            index
            element={
              <RoleRoute allowedRoles={["admin", "sales", "inventory"]}>
                <Dashboard />
              </RoleRoute>
            }
          />
          <Route
            path="manage-inventory"
            element={
              <RoleRoute allowedRoles={["admin", "inventory"]}>
                <ManageInventory />
              </RoleRoute>
            }
          />
          <Route
            path="manage-orders"
            element={
              <RoleRoute allowedRoles={["admin", "sales"]}>
                <ManageOrders />
              </RoleRoute>
            }
          />
          <Route
            path="supplies"
            element={
              <RoleRoute allowedRoles={["admin", "inventory"]}>
                <BuySupplies />
              </RoleRoute>
            }
          />
          <Route
            path="manage-users"
            element={
              <RoleRoute allowedRoles={["admin"]}>
                <ManageUsers />
              </RoleRoute>
            }
          />
          <Route
            path="settings"
            element={
              <RoleRoute allowedRoles={["admin"]}>
                <Settings />
              </RoleRoute>
            }
          />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/test" element={<Test />} />
      </Routes>
    </Router>
  );
}