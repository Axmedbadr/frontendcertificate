import { useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import MetricCard from '../components/MetricCard';
import BarChart from '../components/BarChart';
import StatusBadge from '../components/StatusBadge';
import { CertStatus } from '../types';

const reportTabs = ['income','expense','profit','certificate'] as const;
const periodTabs = ['daily','weekly','monthly','yearly'] as const;
const periodDays: Record<typeof periodTabs[number], number> = { daily: 1, weekly: 7, monthly: 30, yearly: 365 };
const statusOrder: CertStatus[] = ['draft','submitted','payment_approved','approved','printed','cancelled'];

function toDateStr(d: Date) { return d.toISOString().slice(0, 10); }

export default function Reports() {
  const { t, incomes, expenses, certificates } = useApp();
  const [reportType, setReportType] = useState<typeof reportTabs[number]>('income');
  const [period, setPeriod] = useState<typeof periodTabs[number]>('monthly');
  const [from, setFrom] = useState(''); const [to, setTo] = useState('');

  const { rangeFrom, rangeTo } = useMemo(() => {
    if (from && to) return { rangeFrom: from, rangeTo: to };
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - (periodDays[period] - 1));
    return { rangeFrom: toDateStr(start), rangeTo: toDateStr(end) };
  }, [from, to, period]);

  const inRange = (date: string) => date >= rangeFrom && date <= rangeTo;

  const filteredIncomes = useMemo(() => incomes.filter(i => inRange(i.date)).sort((a, b) => b.date.localeCompare(a.date)), [incomes, rangeFrom, rangeTo]);
  const filteredExpenses = useMemo(() => expenses.filter(e => inRange(e.date)).sort((a, b) => b.date.localeCompare(a.date)), [expenses, rangeFrom, rangeTo]);
  const filteredCerts = useMemo(() => certificates.filter(c => inRange(c.issue_date)).sort((a, b) => b.issue_date.localeCompare(a.issue_date)), [certificates, rangeFrom, rangeTo]);

  const totalIncome = filteredIncomes.reduce((a, b) => a + b.amount, 0);
  const totalExpense = filteredExpenses.reduce((a, b) => a + b.amount, 0);
  const totalFees = filteredCerts.reduce((a, b) => a + (b.feeAmount || 0), 0);

  const byCategory = (list: typeof incomes) => {
    const map = new Map<string, number>();
    list.forEach(i => map.set(i.category, (map.get(i.category) || 0) + i.amount));
    return Array.from(map.entries()).map(([label, value]) => ({ label, value }));
  };

  const statusCounts = statusOrder.map(s => ({ label: s.replace('_', ' '), value: filteredCerts.filter(c => c.status === s).length }));

  const periodLabel = from && to ? `${from} — ${to}` : `${t[('report' + period.charAt(0).toUpperCase() + period.slice(1)) as keyof typeof t]} (${rangeFrom} — ${rangeTo})`;

  return (
    <div className="max-w-5xl">
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
            <button key={p} onClick={() => { setPeriod(p); setFrom(''); setTo(''); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold ${period === p && !from && !to ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600'}`}>
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

      <div className="text-xs text-slate-500 font-semibold mb-3.5">Showing: {periodLabel}</div>

      {reportType === 'income' && (
        <>
          <div className="grid grid-cols-3 gap-4 mb-5">
            <MetricCard label="Total Income" value={`$${totalIncome.toLocaleString()}`} variant="primary" />
            <MetricCard label="Transactions" value={filteredIncomes.length} />
            <MetricCard label="Average per Transaction" value={`$${filteredIncomes.length ? Math.round(totalIncome / filteredIncomes.length).toLocaleString() : 0}`} />
          </div>
          {byCategory(filteredIncomes).length > 0 && (
            <div className="bg-white border border-slate-200 rounded-xl p-5 mb-5">
              <h3 className="text-sm font-bold mb-4">By Category</h3>
              <BarChart data={byCategory(filteredIncomes)} />
            </div>
          )}
          <div className="bg-white border border-slate-200 rounded-xl overflow-x-auto">
            <table className="w-full text-sm min-w-[600px]">
              <thead><tr className="text-left text-slate-500 border-b border-slate-200">
                <th className="p-3 font-bold">Date</th><th className="p-3 font-bold">Category</th><th className="p-3 font-bold">Description</th><th className="p-3 font-bold">Account</th><th className="p-3 font-bold text-right">Amount</th>
              </tr></thead>
              <tbody>
                {filteredIncomes.map(i => (
                  <tr key={i.id} className="border-b border-slate-100 last:border-0">
                    <td className="p-3 text-slate-500">{i.date}</td>
                    <td className="p-3">{i.category}</td>
                    <td className="p-3">{i.description}</td>
                    <td className="p-3">{i.account || '—'}</td>
                    <td className="p-3 text-right font-bold text-emerald-600">+${i.amount.toLocaleString()}</td>
                  </tr>
                ))}
                {filteredIncomes.length === 0 && <tr><td colSpan={5} className="p-6 text-center text-slate-400">No income in this period.</td></tr>}
              </tbody>
            </table>
          </div>
        </>
      )}

      {reportType === 'expense' && (
        <>
          <div className="grid grid-cols-3 gap-4 mb-5">
            <MetricCard label="Total Expense" value={`$${totalExpense.toLocaleString()}`} variant="warning" />
            <MetricCard label="Transactions" value={filteredExpenses.length} />
            <MetricCard label="Average per Transaction" value={`$${filteredExpenses.length ? Math.round(totalExpense / filteredExpenses.length).toLocaleString() : 0}`} />
          </div>
          {byCategory(filteredExpenses).length > 0 && (
            <div className="bg-white border border-slate-200 rounded-xl p-5 mb-5">
              <h3 className="text-sm font-bold mb-4">By Category</h3>
              <BarChart data={byCategory(filteredExpenses)} barColor="bg-amber-500" />
            </div>
          )}
          <div className="bg-white border border-slate-200 rounded-xl overflow-x-auto">
            <table className="w-full text-sm min-w-[600px]">
              <thead><tr className="text-left text-slate-500 border-b border-slate-200">
                <th className="p-3 font-bold">Date</th><th className="p-3 font-bold">Category</th><th className="p-3 font-bold">Description</th><th className="p-3 font-bold">Account</th><th className="p-3 font-bold text-right">Amount</th>
              </tr></thead>
              <tbody>
                {filteredExpenses.map(e => (
                  <tr key={e.id} className="border-b border-slate-100 last:border-0">
                    <td className="p-3 text-slate-500">{e.date}</td>
                    <td className="p-3">{e.category}</td>
                    <td className="p-3">{e.description}</td>
                    <td className="p-3">{e.account || '—'}</td>
                    <td className="p-3 text-right font-bold text-red-600">-${e.amount.toLocaleString()}</td>
                  </tr>
                ))}
                {filteredExpenses.length === 0 && <tr><td colSpan={5} className="p-6 text-center text-slate-400">No expenses in this period.</td></tr>}
              </tbody>
            </table>
          </div>
        </>
      )}

      {reportType === 'profit' && (
        <>
          <div className="grid grid-cols-3 gap-4 mb-5">
            <MetricCard label="Total Income" value={`$${totalIncome.toLocaleString()}`} />
            <MetricCard label="Total Expense" value={`$${totalExpense.toLocaleString()}`} />
            <MetricCard label="Net Profit" value={`$${(totalIncome - totalExpense).toLocaleString()}`} variant="primary" />
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-5 mb-5">
            <h3 className="text-sm font-bold mb-4">Income vs Expense</h3>
            <BarChart data={[{ label: 'Income', value: totalIncome }, { label: 'Expense', value: totalExpense }]} />
          </div>
          <div className="bg-white border border-slate-200 rounded-xl overflow-x-auto">
            <table className="w-full text-sm min-w-[600px]">
              <thead><tr className="text-left text-slate-500 border-b border-slate-200">
                <th className="p-3 font-bold">Date</th><th className="p-3 font-bold">Type</th><th className="p-3 font-bold">Category</th><th className="p-3 font-bold">Description</th><th className="p-3 font-bold text-right">Amount</th>
              </tr></thead>
              <tbody>
                {[...filteredIncomes.map(i => ({ ...i, kind: 'Income' as const })), ...filteredExpenses.map(e => ({ ...e, kind: 'Expense' as const }))]
                  .sort((a, b) => b.date.localeCompare(a.date))
                  .map(row => (
                    <tr key={`${row.kind}-${row.id}`} className="border-b border-slate-100 last:border-0">
                      <td className="p-3 text-slate-500">{row.date}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-md text-xs font-bold ${row.kind === 'Income' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>{row.kind}</span>
                      </td>
                      <td className="p-3">{row.category}</td>
                      <td className="p-3">{row.description}</td>
                      <td className={`p-3 text-right font-bold ${row.kind === 'Income' ? 'text-emerald-600' : 'text-red-600'}`}>{row.kind === 'Income' ? '+' : '-'}${row.amount.toLocaleString()}</td>
                    </tr>
                  ))}
                {filteredIncomes.length === 0 && filteredExpenses.length === 0 && <tr><td colSpan={5} className="p-6 text-center text-slate-400">No transactions in this period.</td></tr>}
              </tbody>
            </table>
          </div>
        </>
      )}

      {reportType === 'certificate' && (
        <>
          <div className="grid grid-cols-4 gap-4 mb-5">
            <MetricCard label="Total Certificates" value={filteredCerts.length} variant="primary" />
            <MetricCard label="Total Fees" value={`$${totalFees.toLocaleString()}`} />
            <MetricCard label="Completed" value={filteredCerts.filter(c => c.status === 'approved' || c.status === 'printed').length} />
            <MetricCard label="Pending" value={filteredCerts.filter(c => c.status === 'submitted' || c.status === 'payment_approved').length} variant="warning" />
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-5 mb-5">
            <h3 className="text-sm font-bold mb-4">By Status</h3>
            <BarChart data={statusCounts} />
          </div>
          <div className="bg-white border border-slate-200 rounded-xl overflow-x-auto">
            <table className="w-full text-sm min-w-[720px]">
              <thead><tr className="text-left text-slate-500 border-b border-slate-200">
                <th className="p-3 font-bold">Certificate No.</th><th className="p-3 font-bold">Exporter</th><th className="p-3 font-bold">Importer</th><th className="p-3 font-bold">Animals</th><th className="p-3 font-bold">Status</th><th className="p-3 font-bold text-right">Fee</th><th className="p-3 font-bold">Issue Date</th>
              </tr></thead>
              <tbody>
                {filteredCerts.map(c => (
                  <tr key={c.id} className="border-b border-slate-100 last:border-0">
                    <td className="p-3 font-bold">{c.certificate_number}</td>
                    <td className="p-3">{c.exporter}</td>
                    <td className="p-3">{c.importer}</td>
                    <td className="p-3">{c.animals}</td>
                    <td className="p-3"><StatusBadge status={c.status} /></td>
                    <td className="p-3 text-right font-bold">${(c.feeAmount || 0).toLocaleString()}</td>
                    <td className="p-3 text-slate-500">{c.issue_date}</td>
                  </tr>
                ))}
                {filteredCerts.length === 0 && <tr><td colSpan={7} className="p-6 text-center text-slate-400">No certificates in this period.</td></tr>}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
