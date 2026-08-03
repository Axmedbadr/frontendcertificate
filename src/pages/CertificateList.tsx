import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import StatusBadge from '../components/StatusBadge';
import { CertStatus } from '../types';
import { Plus } from 'lucide-react';

const filters: (CertStatus | 'all')[] = ['all','draft','submitted','payment_approved','approved','printed','cancelled'];

export default function CertificateList() {
  const { certificates } = useApp();
  const [filter, setFilter] = useState<CertStatus | 'all'>('all');
  const navigate = useNavigate();
  const rows = certificates.filter(c => filter === 'all' || c.status === filter);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex flex-wrap gap-2">
          {filters.map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold ${filter === f ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
              {f === 'all' ? 'All' : f.replace('_',' ')}
            </button>
          ))}
        </div>
        <button onClick={() => navigate('/certificates/new')} className="flex items-center gap-2 bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-bold">
          <Plus size={16} /> New Certificate
        </button>
      </div>
      <div className="bg-white border border-slate-200 rounded-xl overflow-x-auto">
        <table className="w-full text-sm min-w-[720px]">
          <thead>
            <tr className="text-left text-slate-500 border-b border-slate-200">
              <th className="p-3 font-bold">Certificate No.</th>
              <th className="p-3 font-bold">Exporter</th>
              <th className="p-3 font-bold">Importer</th>
              <th className="p-3 font-bold">Animals</th>
              <th className="p-3 font-bold">Status</th>
              <th className="p-3 font-bold">Issue Date</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(c => (
              <tr key={c.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 cursor-pointer">
                <td className="p-3 font-bold">{c.certificate_number}</td>
                <td className="p-3">{c.exporter}</td>
                <td className="p-3">{c.importer}</td>
                <td className="p-3">{c.animals}</td>
                <td className="p-3"><StatusBadge status={c.status} /></td>
                <td className="p-3 text-slate-500">{c.issue_date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
