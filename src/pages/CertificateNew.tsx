import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp, emptyAnimalRow } from '../context/AppContext';
import { AnimalRow, Certificate } from '../types';

const steps = ['Basic Info', 'Animal Details', 'Veterinary Checklist', 'Preview'];

export default function CertificateNew() {
  const { addCertificate } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    exporter: '', importer: '', country: '', port: '', transport: '', loadingPlace: '',
    quarantineDays: '', rvf: '', brucella: '', vaccination: '', clinicalExam: '',
  });
  const [rows, setRows] = useState<AnimalRow[]>([emptyAnimalRow()]);

  const updateRow = (i: number, key: keyof AnimalRow, val: string) =>
    setRows(prev => prev.map((r, idx) => idx === i ? { ...r, [key]: val } : r));

  const inputCls = 'px-2.5 py-2 rounded-lg border border-slate-300 text-sm w-full';
  const labelCls = 'flex flex-col gap-1.5 text-xs font-bold text-slate-500';

  const submit = (status: Certificate['status']) => {
    const cert: Certificate = {
      id: Date.now(), certificate_number: 'LCS-2026-0' + (150 + Math.floor(Math.random() * 50)),
      exporter: form.exporter || '—', importer: form.importer || '—', country: form.country || '—',
      animals: rows.filter(r => r.species).map(r => `${r.species} ×${r.quantity}`).join(', '),
      animalRows: rows, status, issue_date: new Date().toISOString().slice(0,10), officer: 'Dr. Ahmed Nur',
      quarantineDays: form.quarantineDays, rvf: form.rvf, brucella: form.brucella,
      vaccination: form.vaccination, clinicalExam: form.clinicalExam,
    };
    addCertificate(cert);
    navigate('/certificates');
  };

  return (
    <div className="max-w-3xl">
      <div className="flex gap-2 mb-6">
        {steps.map((s, i) => (
          <button key={s} onClick={() => setStep(i + 1)}
            className={`flex-1 py-2.5 rounded-lg text-xs font-bold ${step === i + 1 ? 'bg-brand-600 text-white' : step > i + 1 ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
            {i + 1}. {s}
          </button>
        ))}
      </div>

      {step === 1 && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 grid sm:grid-cols-2 gap-3.5">
          <label className={labelCls}>Exporter<input className={inputCls} value={form.exporter} onChange={e => setForm(f => ({ ...f, exporter: e.target.value }))} /></label>
          <label className={labelCls}>Importer<input className={inputCls} value={form.importer} onChange={e => setForm(f => ({ ...f, importer: e.target.value }))} /></label>
          <label className={labelCls}>Country<input className={inputCls} value={form.country} onChange={e => setForm(f => ({ ...f, country: e.target.value }))} /></label>
          <label className={labelCls}>Port<input className={inputCls} value={form.port} onChange={e => setForm(f => ({ ...f, port: e.target.value }))} /></label>
        </div>
      )}

      {step === 2 && (
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          {rows.map((row, i) => (
            <div key={i} className="grid sm:grid-cols-2 gap-2.5 mb-3">
              <label className={labelCls}>Species
                <select className={inputCls} value={row.species} onChange={e => updateRow(i, 'species', e.target.value)}>
                  <option value="">—</option><option>Cattle</option><option>Sheep</option><option>Goat</option><option>Camel</option>
                </select>
              </label>
              <label className={labelCls}>Quantity<input type="number" className={inputCls} value={row.quantity} onChange={e => updateRow(i, 'quantity', e.target.value)} /></label>
            </div>
          ))}
          <button onClick={() => setRows(r => [...r, emptyAnimalRow()])} className="text-brand-600 font-bold text-xs">+ Add species</button>
        </div>
      )}

      {step === 3 && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 grid sm:grid-cols-2 gap-3.5">
          <label className={labelCls}>Quarantine Days<input className={inputCls} value={form.quarantineDays} onChange={e => setForm(f => ({ ...f, quarantineDays: e.target.value }))} /></label>
          <label className={labelCls}>RVF
            <select className={inputCls} value={form.rvf} onChange={e => setForm(f => ({ ...f, rvf: e.target.value }))}><option value="">—</option><option>Negative</option><option>Positive</option></select>
          </label>
          <label className={labelCls}>Brucella
            <select className={inputCls} value={form.brucella} onChange={e => setForm(f => ({ ...f, brucella: e.target.value }))}><option value="">—</option><option>Negative</option><option>Positive</option></select>
          </label>
          <label className={labelCls}>Vaccination
            <select className={inputCls} value={form.vaccination} onChange={e => setForm(f => ({ ...f, vaccination: e.target.value }))}><option value="">—</option><option>Up to date</option><option>Overdue</option></select>
          </label>
        </div>
      )}

      {step === 4 && (
        <div className="bg-white border border-slate-200 rounded-xl p-8">
          <div className="text-center mb-6">
            <div className="text-lg font-extrabold">Export Health Certificate</div>
            <div className="text-xs text-slate-500">Livestock Certification Authority</div>
          </div>
          <div className="grid sm:grid-cols-2 gap-3 text-sm">
            <div><b>Exporter:</b> {form.exporter || '—'}</div>
            <div><b>Importer:</b> {form.importer || '—'}</div>
            <div><b>Country:</b> {form.country || '—'}</div>
            <div><b>Port:</b> {form.port || '—'}</div>
          </div>
          <div className="flex gap-2.5 mt-8">
            <button onClick={() => submit('draft')} className="px-4 py-2 rounded-lg text-sm font-bold bg-slate-100">Save Draft</button>
            <button onClick={() => submit('submitted')} className="px-4 py-2 rounded-lg text-sm font-bold bg-brand-600 text-white">Submit</button>
          </div>
        </div>
      )}

      {step < 4 && (
        <div className="flex justify-between mt-5">
          <button onClick={() => setStep(s => Math.max(1, s - 1))} className={`px-4 py-2 rounded-lg text-sm font-bold bg-slate-100 ${step === 1 ? 'invisible' : ''}`}>Back</button>
          <button onClick={() => setStep(s => Math.min(4, s + 1))} className="px-4 py-2 rounded-lg text-sm font-bold bg-brand-600 text-white">Next</button>
        </div>
      )}
    </div>
  );
}
