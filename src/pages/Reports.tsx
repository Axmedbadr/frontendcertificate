import { useState } from 'react';
import { useApp } from '../context/AppContext';

const reportTabs = ['income','expense','profit','certificate'] as const;
const periodTabs = ['daily','weekly','monthly','yearly'] as const;

export default function Reports() {
  const { t, incomes, expenses, certificates } = useApp();
  const [reportType, setReportType] = useState<typeof reportTabs[number]>('income');
  const [period, setPeriod] = useState<typeof periodTabs[number]>('monthly');
  const [from, setFrom] = useState(''); const [to, setTo] = useState('');

  const totalIncome = incomes.reduce((a, b) => a + b.amount, 0);
  const totalExpense = expenses.reduce((a, b) => a + b.amount, 0);
  const totals: Record<typeof reportTabs[number], number> = {
    income: totalIncome, expense: totalExpense, profit: totalIncome - totalExpense, certificate: certificates.length,
  };

  return (
    <div className="max-w-4xl">
      <div className="flex flex-wrap items-center gap-3.5 mb-5">
        <div className="flex gap-1.5">
          {reportTabs.map(r => (
            <button key={r} onClick={() => setReportType(r)} className={`px-3 py-1.5 rounded-lg text-xs font-bold ${reportType === r ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
              {t[('report' + r.charAt(0).toUpperCase() + r.slice(1)) as keyof typeof t] as string}
            </button>
          ))}
        </div>
        <div className="flex gap-1.5">
          {periodTabs.map(p => (
            <button key={p} onClick={() => setPeriod(p)} className={`px-3 py-1.5 rounded-lg text-xs font-bold ${period === p ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600'}`}>
              {t[('report' + p.charAt(0).toUpperCase() + p.slice(1)) as keyof typeof t] as string}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <input type="date" className="px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold" value={from} onChange={e => setFrom(e.target.value)} />
          <span className="text-xs text-slate-500 font-semibold">{t.reportTo}</span>
          <input type="date" className="px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold" value={to} onChange={e => setTo(e.target.value)} />
        </div>
      </div>
      <div className="bg-white border border-slate-200 rounded-xl p-8 text-center">
        <div className="text-xs font-bold text-slate-500 uppercase mb-2">{reportType} total</div>
        <div className="text-4xl font-extrabold">{reportType === 'certificate' ? totals[reportType] : `$${totals[reportType].toLocaleString()}`}</div>
      </div>
    </div>
  );
}
