import { useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import StatusBadge from '../components/StatusBadge';
import { CheckCircle2 } from 'lucide-react';

export default function FieldCollectorHistory() {
  const { certificates } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const justSubmitted = (location.state as { justSubmitted?: string } | null)?.justSubmitted;

  const submissions = certificates
    .filter(c => c.officer === 'Field Collector')
    .sort((a, b) => b.id - a.id);

  return (
    <div className="max-w-4xl">
      {justSubmitted && (
        <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl px-4 py-3.5 mb-5">
          <CheckCircle2 size={20} className="shrink-0" />
          <div className="text-sm font-semibold">
            Application <span className="font-extrabold">{justSubmitted}</span> submitted successfully — waiting for payment verification.
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-3.5">
        <h3 className="text-sm font-bold">Submission History</h3>
        <button onClick={() => navigate('/field-collector')} className="text-xs font-bold text-brand-600">+ New Submission</button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-x-auto">
        <table className="w-full text-sm min-w-[680px]">
          <thead><tr className="text-left text-slate-500 border-b border-slate-200">
            <th className="p-3 font-bold">Certificate No.</th>
            <th className="p-3 font-bold">Exporter</th>
            <th className="p-3 font-bold">Importer</th>
            <th className="p-3 font-bold">Animals</th>
            <th className="p-3 font-bold">Status</th>
            <th className="p-3 font-bold">Submitted</th>
          </tr></thead>
          <tbody>
            {submissions.map(c => (
              <tr key={c.id} className={`border-b border-slate-100 last:border-0 ${c.certificate_number === justSubmitted ? 'bg-emerald-50/60' : ''}`}>
                <td className="p-3 font-bold">{c.certificate_number}</td>
                <td className="p-3">{c.exporter}</td>
                <td className="p-3">{c.importer}</td>
                <td className="p-3">{c.animals}</td>
                <td className="p-3"><StatusBadge status={c.status} /></td>
                <td className="p-3 text-slate-500">{c.issue_date}</td>
              </tr>
            ))}
            {submissions.length === 0 && <tr><td colSpan={6} className="p-6 text-center text-slate-400">No submissions yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
