import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AccountName } from '../types';

const categories = ['Office Rent','Salary','Fuel','Electricity','Internet','Printing','Medicine','Laboratory','Other'];
const accountOptions: AccountName[] = ['Cash', 'Bank', 'ZAAD', 'EVC Plus', 'Premier Wallet'];

export default function Expenses() {
  const { expenses, addExpense } = useApp();
  const [form, setForm] = useState({ category: categories[0], amount: '', description: '', account: 'Cash' as AccountName });
  const total = expenses.reduce((a, b) => a + b.amount, 0);

  const submit = () => {
    if (!form.amount) return;
    addExpense({ id: Date.now(), category: form.category, amount: Number(form.amount), description: form.description, date: new Date().toISOString().slice(0,10), account: form.account });
    setForm({ category: categories[0], amount: '', description: '', account: 'Cash' });
  };

  return (
    <div className="max-w-4xl grid lg:grid-cols-[1fr_320px] gap-6">
      <div>
        <div className="bg-white border border-slate-200 rounded-xl overflow-x-auto">
          <table className="w-full text-sm min-w-[520px]">
            <thead><tr className="text-left text-slate-500 border-b border-slate-200">
              <th className="p-3 font-bold">Category</th><th className="p-3 font-bold">Description</th><th className="p-3 font-bold">Account</th><th className="p-3 font-bold">Amount</th><th className="p-3 font-bold">Date</th>
            </tr></thead>
            <tbody>
              {expenses.map(e => (
                <tr key={e.id} className="border-b border-slate-100 last:border-0">
                  <td className="p-3">{e.category}</td><td className="p-3">{e.description}</td><td className="p-3">{e.account}</td>
                  <td className="p-3 font-bold text-red-500">-${e.amount}</td><td className="p-3 text-slate-500">{e.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-3 text-sm font-bold">Total Expenses: <span className="text-red-500">${total.toLocaleString()}</span></div>
      </div>
      <div className="bg-white border border-slate-200 rounded-xl p-5 h-fit">
        <h3 className="text-sm font-bold mb-3.5">Add Expense</h3>
        <div className="flex flex-col gap-3">
          <select className="px-3 py-2 rounded-lg border border-slate-300 text-sm" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
            {categories.map(c => <option key={c}>{c}</option>)}
          </select>
          <input type="number" placeholder="Amount" className="px-3 py-2 rounded-lg border border-slate-300 text-sm" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} />
          <select className="px-3 py-2 rounded-lg border border-slate-300 text-sm" value={form.account} onChange={e => setForm(f => ({ ...f, account: e.target.value as AccountName }))}>
            {accountOptions.map(a => <option key={a}>{a}</option>)}
          </select>
          <textarea placeholder="Description" className="px-3 py-2 rounded-lg border border-slate-300 text-sm resize-y min-h-[70px]" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          <button onClick={submit} className="bg-brand-600 text-white px-4 py-2.5 rounded-lg text-sm font-bold">Add Expense</button>
        </div>
      </div>
    </div>
  );
}
