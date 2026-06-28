import "../styles/global.css";
import "../styles/sidebar.css";
import "../styles/navbar.css";
import "../styles/dashboard.css";
import "../styles/table.css";
import "../styles/product.css";
import "../styles/modal.css";
import 'react-toastify/dist/ReactToastify.css';

import {
  Routes,
  Route
}
from "react-router-dom";

import Dashboard from
"../pages/Dashboard";

import Products from
"../pages/Products";

import MainLayout from
"../layouts/MainLayout";

function AppRoutes() {
  return (
    <div id="inventory-mf-scope">
      <MainLayout>
        <Routes>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<Products />} />
        </Routes>
      </MainLayout>
    </div>
  );
}

export default AppRoutes;
