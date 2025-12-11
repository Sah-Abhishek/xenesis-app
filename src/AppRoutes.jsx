import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Layout from "./Layout";
import SignupPage from "./pages/LoginPage";
import ProtectedRoute from "./routes/ProtectedRoute";
import LandingPage from "./pages/LandingPage";
import RoleRoute from "./routes/RoleRoute";
import InventoryPage from "./pages/sales/Inventory.jsx";
import SalesDashboard from "./pages/SalesDashboard";
import TicketsPage from "./pages/TicketsPage.jsx";
import CreateNewProductTicket from "./pages/Ticket/TicketNewProduct.jsx";
import CreateExistingProductTicket from "./pages/Ticket/TicketExistingProduct.jsx";
import AddProductPage from "./pages/sales/AddNewProduct.jsx";
import CreateBulkOrderTicket from "./pages/Ticket/TicketBulkOrder.jsx";
import TicketDetails from "./pages/Ticket/TicketDetailsPage.jsx";
import PurchaseDashboard from "./pages/purchase/PurchaseDashboard.jsx";
import AddNewSupplier from "./pages/purchase/AddNewSuppliers.jsx";
import SuppliersPage from "./pages/purchase/SuppliersPage.jsx";

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
            <Route path="/ticketspage" element={<TicketsPage />} />
            <Route path="/tickets/createticket/newproduct" element={<CreateNewProductTicket />} />
            <Route path="/tickets/createticket/existingproduct" element={<CreateExistingProductTicket />} />
            <Route path="/tickets/createticket/bulkorder" element={<CreateBulkOrderTicket />} />
            <Route path="/tickets/:ticketId" element={<TicketDetails />} />
          </Route>
        </Route>

        {/* Purchase-only */}
        <Route element={<RoleRoute allowed={["purchase"]} />}>
          <Route element={<Layout />}>
            <Route path="/purchase/dashboard" element={<PurchaseDashboard />} />
            <Route path="/inventory/addnewproduct" element={<AddProductPage />} />
            <Route path="/supplier/addnewsupplier" element={<AddNewSupplier />} />
            <Route path="/suplierspage" element={<SuppliersPage />} />

            {/* Add more purchase-only screens here */}
          </Route>
        </Route>

        {/* Shared pages for multiple roles */}
        <Route element={<RoleRoute allowed={["manager", "sales", "purchase", "admin"]} />}>
          <Route element={<Layout />}>
            <Route path="/inventory" element={<InventoryPage />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
