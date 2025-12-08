// src/routes/RoleRoute.jsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore"; // adjust path if needed

const RoleRoute = ({ allowed = [] }) => {
  // subscribe only to needed slices to avoid extra re-renders
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);

  // not authenticated -> send to login
  if (!token && !user) {
    return <Navigate to="/login" replace />;
  }

  // if no allowed roles were provided, allow any authenticated user
  if (!allowed || (Array.isArray(allowed) && allowed.length === 0)) {
    return <Outlet />;
  }

  // normalize allowed to array
  const allowedRoles = Array.isArray(allowed) ? allowed : [allowed];

  // if user isn't loaded yet or role not allowed -> unauthorized
  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // authorized
  return <Outlet />;
};

export default RoleRoute;
