import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore";

const ProtectedRoute = () => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn()); // boolean
  console.log("This is the value of isloggedIn: ", isLoggedIn)

  return isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
