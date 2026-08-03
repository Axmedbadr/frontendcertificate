import { useState } from 'react';

export default function Settings() {
  const [authorityEn, setAuthorityEn] = useState('Livestock Certification Authority');
  const [taxRate, setTaxRate] = useState('5');
  return (
    <div className="max-w-xl bg-white border border-slate-200 rounded-xl p-5 flex flex-col gap-3.5">
      <label className="flex flex-col gap-1.5 text-xs font-bold text-slate-500">Authority Name (English)
        <input className="px-3 py-2 rounded-lg border border-slate-300 text-sm" value={authorityEn} onChange={e => setAuthorityEn(e.target.value)} />
      </label>
      <label className="flex flex-col gap-1.5 text-xs font-bold text-slate-500">Tax Rate (%)
        <input type="number" className="px-3 py-2 rounded-lg border border-slate-300 text-sm" value={taxRate} onChange={e => setTaxRate(e.target.value)} />
      </label>
      <button className="bg-brand-600 text-white px-4 py-2.5 rounded-lg text-sm font-bold self-start">Save Settings</button>
    </div>
  );
}
