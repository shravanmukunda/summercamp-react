import { NavLink, Outlet, useNavigate } from 'react-router-dom';

import { clearAdminToken } from '@/lib/adminAuth';

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
    isActive ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
  }`;

const AdminLayout: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = (): void => {
    clearAdminToken();
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside className="w-56 shrink-0 bg-slate-900 text-white flex flex-col">
        <div className="p-4 border-b border-slate-800">
          <p className="text-xs uppercase tracking-wide text-slate-400">Summer Camp</p>
          <p className="text-lg font-semibold">Admin</p>
        </div>
        <nav className="p-3 flex-1 space-y-1">
          <NavLink to="/admin/dashboard" className={linkClass} end>
            Dashboard
          </NavLink>
          <NavLink to="/admin/institutions" className={linkClass}>
            Institutions
          </NavLink>
          <NavLink to="/admin/applications" className={linkClass}>
            Listing applications
          </NavLink>
          <NavLink to="/admin/messages" className={linkClass}>
            Contact messages
          </NavLink>
        </nav>
        <div className="p-3 border-t border-slate-800">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full text-left px-3 py-2 rounded-md text-sm text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            Log out
          </button>
        </div>
      </aside>
      <main className="flex-1 min-w-0 p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
