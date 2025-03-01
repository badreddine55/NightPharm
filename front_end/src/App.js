import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignUpPage from './component/Auth/SignUpPage';
import Login from './component/Auth/Login';
import ForgotPassword from './component/Auth/ForgotPassword';
import ResetPassword from './component/Auth/ResetPassword';
import Dashboard from './component/SeperAdmin/Dashboard';
import HistoryOfReports from './component/SeperAdmin/HistoryOfReports';
import DashbordNuers from './component/Nuers/DashbordNuers'
import NuersCrud from './component/Nuers/NuersCrud';
import SendReport from './component/Nuers/SendReport';
import ListDeliveries from './component/Nuers/ListDeliveries';
import ProductManagement from './component/Nuers/ProductManagement'
import PharmacyCrud from './component/Pharmacy/PharmacyCrud';
import SupplierCrud from './component/Supplier/SupplierCrud';
import ProtectedRoute from './component/Auth/ProtectedRoute'; // Import the updated ProtectedRoute component
import ProtectedRouteGoogel from './component/Auth/ProtectedRouteGoogel';
import NearbyPharmacies from './component/Pharmacy/NearbyPharmacies';
import SupplierDshbard from './component/Supplier/SupplierDshbard';
import AddDelivery from './component/Supplier/AddDelivery';
import DashboardUser from './component/User/DashbordUser';
import AuthUser from './component/User/AuthUser';
import PharmacyShow from './component/User/PharmacyShow'
import Map from './component/User/Map'
import Consultation from './component/User/Consultation';
import TakeConsultation from './component/Nuers/TakeConsultation';
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/SignUpPage" element={<SignUpPage />} />
        <Route path="/ResetPassword" element={<ResetPassword />} />
        <Route path="/ForgotPassword" element={<ForgotPassword />} />
        <Route path="/" element={<Login />} />
        <Route path="/DashboardUser" element={<DashboardUser />} />
        <Route element={<ProtectedRouteGoogel />}>
          <Route path="/AuthUser" element={<AuthUser />} />
          <Route path="/Consultation" element={<Consultation />} />
          <Route path="/PharmacyShow" element={<PharmacyShow />} />
          <Route path="/Map" element={<Map />} />
        </Route>

        {/* Protected Routes */}
        <Route
          path="/Dashboard"
          element={
            <ProtectedRoute allowedRoles={["superadmin"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ProductManagement"
          element={
            <ProtectedRoute allowedRoles={["nurse", "superadmin"]}>
              <ProductManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/NursesManagement"
          element={
            <ProtectedRoute allowedRoles={["superadmin"]}>
              <NuersCrud />
            </ProtectedRoute>
          }
        />
        <Route
          path="/PharmacyManagement"
          element={
            <ProtectedRoute allowedRoles={["superadmin"]}>
              <PharmacyCrud />
            </ProtectedRoute>
          }
        />
        <Route
          path="/SupplierManagement"
          element={
            <ProtectedRoute allowedRoles={["superadmin"]}>
              <SupplierCrud />
            </ProtectedRoute>
          }
        />
        <Route
          path="/HistoryOfReports"
          element={
            <ProtectedRoute allowedRoles={["superadmin"]}>
              <HistoryOfReports />
            </ProtectedRoute>
          }
        />
        <Route
          path="/NearbyPharmacies"
          element={
            <ProtectedRoute allowedRoles={["nurse", "superadmin"]}>
              <NearbyPharmacies />
            </ProtectedRoute>
          }
        />
        <Route
          path="/SupplierDshbard"
          element={
            <ProtectedRoute allowedRoles={["Supplier"]}>
              <SupplierDshbard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/AddDelivery"
          element={
            <ProtectedRoute allowedRoles={["Supplier"]}>
              <AddDelivery />
            </ProtectedRoute>
          }
        />

        <Route
        path="/DashbordNuers"
        element={
          <ProtectedRoute allowedRoles={["nurse"]}>
            <DashbordNuers />
          </ProtectedRoute>
        }
      />
      <Route
      path="/TakeConsultation"
      element={
        <ProtectedRoute allowedRoles={["nurse"]}>
          <TakeConsultation />
        </ProtectedRoute>
      }
    />
      <Route
      path="/SendReport"
      element={
        <ProtectedRoute allowedRoles={["nurse"]}>
          <SendReport />
        </ProtectedRoute>
      }
    />
    <Route
    path="/ListDeliveries"
    element={
      <ProtectedRoute allowedRoles={["nurse"]}>
        <ListDeliveries />
      </ProtectedRoute>
    }
  />
      </Routes>
    </Router>
  );
}