import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { AdminLayout } from './components/layout/AdminLayout';
import { POSPage } from './pages/POSPage';
import { DashboardPage } from './pages/DashboardPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { InventoryPage } from './pages/admin/InventoryPage';
import { UserManagementPage } from './pages/admin/UserManagementPage';
import { PurchaseHistoryPage } from './pages/admin/PurchaseHistoryPage';
import { ReportsPage } from './pages/admin/ReportsPage';
import { BankAccountPage } from './pages/admin/BankAccountPage';
import { ExpensesPage } from './pages/admin/ExpensesPage';
import { StockPage } from './pages/admin/StockPage';
import { SettingsPage } from './pages/admin/SettingsPage';
import { DeveloperLayout } from './components/layout/DeveloperLayout';
import { CompaniesPage } from './pages/developer/CompaniesPage';
import { SyncProvider } from './contexts/SyncContext';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/common/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <SyncProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Cashier Routes */}
            <Route element={<ProtectedRoute roles={['cashier', 'admin']} />}>
              <Route path="/" element={<MainLayout />}>
                <Route index element={<POSPage />} />
                <Route path="dashboard" element={<DashboardPage />} />
              </Route>
            </Route>

            {/* Admin Routes */}
            <Route path="/admin" element={<ProtectedRoute roles={['admin']} />}>
              <Route element={<AdminLayout />}>
                <Route index element={<DashboardPage />} />
                <Route path="inventory" element={<InventoryPage />} />
                <Route path="users" element={<UserManagementPage />} />
                <Route path="purchases" element={<PurchaseHistoryPage />} />
                <Route path="reports" element={<ReportsPage />} />
                <Route path="bank" element={<BankAccountPage />} />
                <Route path="expenses" element={<ExpensesPage />} />
                <Route path="stock" element={<StockPage />} />
                <Route path="settings" element={<SettingsPage />} />
              </Route>
            </Route>

            {/* Developer Routes */}
            <Route path="/developer" element={<ProtectedRoute roles={['developer']} />}>
              <Route element={<DeveloperLayout />}>
                <Route index element={<CompaniesPage />} />
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </SyncProvider>
    </AuthProvider>
  );
}

export default App;
