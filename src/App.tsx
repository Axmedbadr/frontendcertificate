import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Observer from './pages/Observer';
import FieldCollector from './pages/FieldCollector';
import FieldCollectorHistory from './pages/FieldCollectorHistory';
import CertificateList from './pages/CertificateList';
import CertificateNew from './pages/CertificateNew';
import CertificateVerify from './pages/CertificateVerify';
import Exporters from './pages/Exporters';
import Importers from './pages/Importers';
import Animals from './pages/Animals';
import Payments from './pages/Payments';
import Income from './pages/Income';
import Expenses from './pages/Expenses';
import Reports from './pages/Reports';
import Users from './pages/Users';
import Settings from './pages/Settings';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/observer" element={<Observer />} />
        <Route path="/field-collector" element={<FieldCollector />} />
        <Route path="/field-collector/history" element={<FieldCollectorHistory />} />
        <Route path="/certificates" element={<CertificateList />} />
        <Route path="/certificates/new" element={<CertificateNew />} />
        <Route path="/certificates/verify" element={<CertificateVerify />} />
        <Route path="/exporters" element={<Exporters />} />
        <Route path="/importers" element={<Importers />} />
        <Route path="/animals" element={<Animals />} />
        <Route path="/payments" element={<Payments />} />
        <Route path="/income" element={<Income />} />
        <Route path="/expenses" element={<Expenses />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/users" element={<Users />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}
