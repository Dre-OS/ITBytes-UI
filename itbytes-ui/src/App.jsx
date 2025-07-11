import { BrowserRouter as Router, Routes, Route, Outlet, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import FramerFadeLayout from "./layouts/FramerFadeLayout";
import UserSession from "./utils/UserSession";

// Admin Routes
import Admin from "./layouts/AdminLayout";
import Dashboard from "./pages/Dashboard";
import ManageInventory from "./pages/ManageInventory";
import ManageOrders from "./pages/ManageOrders";
import ManageUsers from "./pages/ManageUsers";
import Settings from "./pages/Settings";
import BuySupplies from "./pages/BuySupplies";
import PendingSupplies from "./pages/PendingSupplies";
import OrderHistory from "./pages/OrderHistory";

// Customer Routes
import Main from "./layouts/MainLayout";
import Products from "./pages/Products";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Order from "./pages/Order";
import Test from "./pages/Test";

import Login from "./pages/Login";
import Register from "./pages/Register";

const PrivateRoute = () => {
  const role = UserSession.getRole();
  UserSession.set({ ...UserSession.get(), isAuthenticated: true });
  if (role == "customer") return <Navigate to="/" />;
  const token = UserSession.isAuthenticated();
  return token ? <Outlet /> : <Navigate to="/" />;
};

const RoleRoute = ({ allowedRoles, children }) => {
  const isAuthenticated = UserSession.isAuthenticated();
  const role = UserSession.getRole();

  if (!isAuthenticated) return <Navigate to="/login" />;
  if (!allowedRoles.includes(role)) return <Navigate to="/" />;

  return children;
};

export default function App() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Main />}>
          <Route index element={<FramerFadeLayout><Home /></FramerFadeLayout>} />
          <Route path="products" element={<FramerFadeLayout><Products /></FramerFadeLayout>} />
          <Route path="cart" element={<FramerFadeLayout><Cart /></FramerFadeLayout>} />
          <Route path="orders" element={<FramerFadeLayout><Order /></FramerFadeLayout>} />
        </Route>

        <Route path="/dashboard" element={<Admin />}>
          <Route
            index
            element={
              <RoleRoute allowedRoles={["admin", "sales", "inventory"]}>
                <FramerFadeLayout><Dashboard /></FramerFadeLayout>
              </RoleRoute>
            }
          />
          <Route
            path="manage-inventory"
            element={
              <RoleRoute allowedRoles={["admin", "inventory"]}>
                <FramerFadeLayout><ManageInventory /></FramerFadeLayout>
              </RoleRoute>
            }
          />
          <Route
            path="manage-orders"
            element={
              <RoleRoute allowedRoles={["admin", "sales"]}>
                <FramerFadeLayout><ManageOrders /></FramerFadeLayout>
              </RoleRoute>
            }
          />
          <Route
            path="supplies"
            element={
              <RoleRoute allowedRoles={["admin", "inventory"]}>
                <FramerFadeLayout><BuySupplies /></FramerFadeLayout>
              </RoleRoute>
            }
          />
          <Route
            path="manage-purchases/pending-supplies"
            element={
              <RoleRoute allowedRoles={["admin", "inventory"]}>
                <FramerFadeLayout><PendingSupplies /></FramerFadeLayout>
              </RoleRoute>
            }
          />
          <Route
            path="manage-purchases/order-history"
            element={
              <RoleRoute allowedRoles={["admin", "inventory"]}>
                <FramerFadeLayout><OrderHistory /></FramerFadeLayout>
              </RoleRoute>
            }
          />
          <Route
            path="manage-users"
            element={
              <RoleRoute allowedRoles={["admin"]}>
                <FramerFadeLayout><ManageUsers /></FramerFadeLayout>
              </RoleRoute>
            }
          />
          <Route
            path="settings"
            element={
              <RoleRoute allowedRoles={["admin"]}>
                <FramerFadeLayout><Settings /></FramerFadeLayout>
              </RoleRoute>
            }
          />
        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/test" element={<Test />} />
      </Routes>
    </AnimatePresence>
  );
}
