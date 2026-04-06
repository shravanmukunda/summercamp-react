import { Navigate, Route, Routes } from 'react-router-dom';

import AdminLayout from '@/components/admin/AdminLayout';
import RequireAdmin from '@/components/admin/RequireAdmin';
import AdminApplications from '@/pages/admin/AdminApplications';
import AdminContactMessages from '@/pages/admin/AdminContactMessages';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminInstitutionForm from '@/pages/admin/AdminInstitutionForm';
import AdminInstitutions from '@/pages/admin/AdminInstitutions';
import AdminLogin from '@/pages/admin/AdminLogin';

const AdminApp: React.FC = () => {
  return (
    <Routes>
      <Route path="login" element={<AdminLogin />} />
      <Route
        element={
          <RequireAdmin>
            <AdminLayout />
          </RequireAdmin>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="institutions" element={<AdminInstitutions />} />
        <Route path="institutions/new" element={<AdminInstitutionForm />} />
        <Route path="institutions/:id/edit" element={<AdminInstitutionForm />} />
        <Route path="applications" element={<AdminApplications />} />
        <Route path="messages" element={<AdminContactMessages />} />
      </Route>
      <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
    </Routes>
  );
};

export default AdminApp;
