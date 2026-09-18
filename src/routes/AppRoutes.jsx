import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import AppShell from '../components/layout/AppShell';

import Login from '../pages/auth/Login';
import ForgotPassword from '../pages/auth/ForgotPassword';

import Dashboard from '../pages/Dashboard';

import MaterialMaster from '../pages/masterdata/MaterialMaster';
import MaterialMasterForm from '../pages/masterdata/MaterialMasterForm';
import BusinessPartner from '../pages/masterdata/BusinessPartner';
import BusinessPartnerForm from '../pages/masterdata/BusinessPartnerForm';
import FixedAssets from '../pages/masterdata/FixedAssets';
import FixedAssetsForm from '../pages/masterdata/FixedAssetsForm';
import GenericMaster from '../pages/masterdata/GenericMaster';
import GenericMasterForm from '../pages/masterdata/GenericMasterForm';

import PurchaseInvoice from '../pages/transactions/PurchaseInvoice';
import PurchaseInvoiceDocument from '../pages/transactions/PurchaseInvoiceDocument';
import SalesInvoice from '../pages/transactions/SalesInvoice';
import SalesInvoiceDocument from '../pages/transactions/SalesInvoiceDocument';
import GenericTransaction from '../pages/transactions/GenericTransaction';
import GenericTransactionForm from '../pages/transactions/GenericTransactionForm';

import Payroll from '../pages/payroll/Payroll';
import EmployeeForm from '../pages/payroll/EmployeeForm';
import UsersSecurity from '../pages/users/UsersSecurity';
import UserForm from '../pages/users/UserForm';
import Reports from '../pages/reports/Reports';
import Administration from '../pages/administration/Administration';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      <Route
        element={
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Material Master */}
        <Route path="/master-data/material-master" element={<MaterialMaster />} />
        <Route path="/master-data/material-master/new" element={<MaterialMasterForm />} />
        <Route path="/master-data/material-master/:id/edit" element={<MaterialMasterForm />} />

        {/* Business Partner */}
        <Route path="/master-data/business-partner" element={<BusinessPartner />} />
        <Route path="/master-data/business-partner/new" element={<BusinessPartnerForm />} />
        <Route path="/master-data/business-partner/:id/edit" element={<BusinessPartnerForm />} />

        {/* Fixed Assets */}
        <Route path="/master-data/fixed-assets" element={<FixedAssets />} />
        <Route path="/master-data/fixed-assets/new" element={<FixedAssetsForm />} />
        <Route path="/master-data/fixed-assets/:id/edit" element={<FixedAssetsForm />} />

        {/* Remaining 16 simple master types, config-driven */}
        <Route path="/master-data/:configKey/new" element={<GenericMasterForm />} />
        <Route path="/master-data/:configKey/:id/edit" element={<GenericMasterForm />} />
        <Route path="/master-data/:configKey" element={<GenericMaster />} />

        {/* Purchase Invoice */}
        <Route path="/transactions/purchase-invoice" element={<PurchaseInvoice />} />
        <Route path="/transactions/purchase-invoice/:id" element={<PurchaseInvoiceDocument />} />

        {/* Sales Invoice */}
        <Route path="/transactions/sales-invoice" element={<SalesInvoice />} />
        <Route path="/transactions/sales-invoice/:id" element={<SalesInvoiceDocument />} />

        {/* Remaining simple transaction types, config-driven */}
        <Route path="/transactions/:configKey/new" element={<GenericTransactionForm />} />
        <Route path="/transactions/:configKey/:id/edit" element={<GenericTransactionForm />} />
        <Route path="/transactions/:configKey" element={<GenericTransaction />} />

        <Route path="/payroll" element={<Payroll />} />
        <Route path="/payroll/employees/new" element={<EmployeeForm />} />
        <Route path="/payroll/employees/:id/edit" element={<EmployeeForm />} />
        <Route path="/users-security" element={<UsersSecurity />} />
        <Route path="/users-security/new" element={<UserForm />} />
        <Route path="/users-security/:id/edit" element={<UserForm />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/administration" element={<Administration />} />

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
