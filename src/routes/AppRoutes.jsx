import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Layout from "./Layout";
import SignupPage from "./pages/LoginPage";
import LandingPage from "./pages/LandingPage";
import SalesDashboard from "./pages/sales/SalesDashboard";
import RoleRoute from "./routes/RoleRoute";
import ProtectedRoute from "./ProtectedRoute";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* All protected */}
      <Route element={<ProtectedRoute />}>
        {/* Sales-only */}
        <Route element={<RoleRoute allowed={["sales"]} />}>
          <Route element={<Layout />}>
            <Route path="/sales/dashboard" element={<SalesDashboard />} />
            {/* <Route path="/sales/leads" element={<SalesLeads />} /> */}
          </Route>
        </Route>

        {/* Purchase-only */}

        {/*   <Route element={<Layout />}> */}
        {/* <Route path="/purchase/dashboard" element={<PurchaseDashboard />} /> */}
        {/*   </Route> */}
        {/* </Route> */}
        {/**/}
        {/* Manager can see both or special pages */}
        {/* <Route element={<RoleRoute allowed={["manager"]} />}> */}
        {/*   <Route element={<Layout />}> */}
        {/*     <Route path="/manager/dashboard" element={<ManagerDashboard />} /> */}
        {/*   </Route> */}
        {/* </Route> */}
        {/**/}
        {/* Shared pages for multiple roles */}
        {/* <Route element={<RoleRoute allowed={["manager", "sales", "purchase", "admin"]} />}> */}
        {/*   <Route element={<Layout />}> */}
        {/*     <Route path="/leads" element={<LeadsPage />} /> */}
        {/*   </Route> */}
        {/* </Route> */}
      </Route>
    </Routes>
  );
};

export default AppRoutes;
