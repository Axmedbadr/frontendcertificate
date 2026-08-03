import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Menu, X, LayoutDashboard, FileText, Wallet, TrendingUp, TrendingDown, Truck,
  Building2, PawPrint, BarChart3, Users, Settings as SettingsIcon, ClipboardList } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Role } from '../types';

interface NavItem { key: string; label: string; icon: React.ReactNode; path: string; roles: Role[]; }

export default function Layout() {
  const { t, lang, toggleLang, currentRole, setCurrentRole } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  const navItems: NavItem[] = [
    { key: 'dashboard', label: t.dashboard, icon: <LayoutDashboard size={18} />, path: '/dashboard', roles: ['Admin', 'Veterinary Officer', 'Data Entry Clerk', 'Finance Officer'] },
    { key: 'observer', label: t.observerDashboard, icon: <LayoutDashboard size={18} />, path: '/observer', roles: ['Observer'] },
    { key: 'fieldCollector', label: t.roleFieldCollector, icon: <ClipboardList size={18} />, path: '/field-collector', roles: ['Data Field Collector'] },
    { key: 'certificates', label: t.certificateManagement, icon: <FileText size={18} />, path: '/certificates', roles: ['Admin', 'Veterinary Officer', 'Data Entry Clerk'] },
    { key: 'exporters', label: t.exporters, icon: <Truck size={18} />, path: '/exporters', roles: ['Admin', 'Data Entry Clerk'] },
    { key: 'importers', label: t.importers, icon: <Building2 size={18} />, path: '/importers', roles: ['Admin', 'Data Entry Clerk'] },
    { key: 'animals', label: t.animals, icon: <PawPrint size={18} />, path: '/animals', roles: ['Admin', 'Veterinary Officer'] },
    { key: 'payments', label: t.payments, icon: <Wallet size={18} />, path: '/payments', roles: ['Admin', 'Finance Officer'] },
    { key: 'income', label: t.income, icon: <TrendingUp size={18} />, path: '/income', roles: ['Admin', 'Finance Officer'] },
    { key: 'expenses', label: t.expenses, icon: <TrendingDown size={18} />, path: '/expenses', roles: ['Admin', 'Finance Officer'] },
    { key: 'reports', label: t.reports, icon: <BarChart3 size={18} />, path: '/reports', roles: ['Admin', 'Finance Officer', 'Observer'] },
    { key: 'users', label: t.users, icon: <Users size={18} />, path: '/users', roles: ['Admin'] },
    { key: 'settings', label: t.settings, icon: <SettingsIcon size={18} />, path: '/settings', roles: ['Admin'] },
  ];

  const visible = navItems.filter(n => n.roles.includes(currentRole));

  const roles: Role[] = ['Admin', 'Veterinary Officer', 'Data Entry Clerk', 'Finance Officer', 'Data Field Collector', 'Observer'];

  const onRoleChange = (r: Role) => {
    setCurrentRole(r);
    setMobileOpen(false);
    if (r === 'Data Field Collector') navigate('/field-collector');
    else if (r === 'Observer') navigate('/observer');
    else navigate('/dashboard');
  };

  return (
    <div dir={dir} className="flex min-h-screen bg-slate-50 text-slate-900">
      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 z-40 w-64 bg-slate-900 text-slate-200 flex flex-col transition-transform ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} ${dir === 'rtl' ? (mobileOpen ? 'right-0 translate-x-0' : 'right-0 translate-x-full lg:translate-x-0') : 'left-0'}`}>
        <div className="p-5 flex items-center gap-3 border-b border-slate-800">
          <div className="w-9 h-9 rounded-lg bg-brand-600 flex items-center justify-center font-extrabold">HL</div>
          <div className="font-extrabold text-sm leading-tight">{t.appName}</div>
        </div>
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
          {visible.map(item => (
            <NavLink
              key={item.key}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${isActive ? 'bg-brand-700 text-white' : 'text-slate-300 hover:bg-slate-800'}`}
            >
              {item.icon}<span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      {mobileOpen && <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={() => setMobileOpen(false)} />}

      {/* Main column */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 gap-3">
          <div className="flex items-center gap-3">
            <button className="lg:hidden p-2 rounded-lg hover:bg-slate-100" onClick={() => setMobileOpen(o => !o)}>
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <h1 className="text-lg font-bold hidden sm:block">{visible.find(v => location.pathname.startsWith(v.path))?.label}</h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <button onClick={toggleLang} className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200">
              {lang === 'en' ? 'العربية' : 'English'}
            </button>
            <select
              value={currentRole}
              onChange={e => onRoleChange(e.target.value as Role)}
              className="px-2 sm:px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 border-none max-w-[130px] sm:max-w-none"
            >
              {roles.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shrink-0">DA</div>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
