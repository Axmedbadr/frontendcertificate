import { useState } from 'react';
import { useApp } from '../context/AppContext';
import Modal from '../components/Modal';
import MetricCard from '../components/MetricCard';
import { ExporterEntity } from '../types';
import { Plus, Search } from 'lucide-react';

const emptyForm = { name: '', contact: '', phone: '', license: '' };

export default function Exporters() {
  const { exporters, addExporter } = useApp();
  const [search, setSearch] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [showModal, setShowModal] = useState(false);

  const filtered = exporters.filter(e =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.contact.toLowerCase().includes(search.toLowerCase()) ||
    e.license.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => { setForm(emptyForm); setShowModal(true); };

  const save = () => {
    if (!form.name.trim()) return;
    addExporter({ id: Date.now(), name: form.name.trim(), contact: form.contact.trim(), phone: form.phone.trim(), license: form.license.trim() });
    setShowModal(false);
  };

  return (
    <div className="max-w-4xl">
      <div className="grid grid-cols-2 gap-4 mb-5">
        <MetricCard label="Total Exporters" value={exporters.length} variant="primary" />
        <MetricCard label="Licensed" value={exporters.filter(e => e.license).length} />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="relative">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            placeholder="Search name, contact, license…"
            className="pl-8 pr-3 py-2 rounded-lg border border-slate-300 text-sm w-64"
            value={search} onChange={e => setSearch(e.target.value)}
          />
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-bold">
          <Plus size={16} /> Add Exporter
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-x-auto">
        <table className="w-full text-sm min-w-[560px]">
          <thead><tr className="text-left text-slate-500 border-b border-slate-200">
            <th className="p-3 font-bold">Name</th><th className="p-3 font-bold">Contact</th><th className="p-3 font-bold">Phone</th><th className="p-3 font-bold">License</th>
          </tr></thead>
          <tbody>
            {filtered.map(e => (
              <tr key={e.id} className="border-b border-slate-100 last:border-0">
                <td className="p-3 font-bold">{e.name}</td><td className="p-3">{e.contact}</td><td className="p-3">{e.phone}</td><td className="p-3">{e.license || '—'}</td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={4} className="p-6 text-center text-slate-400">No exporters match.</td></tr>}
          </tbody>
        </table>
      </div>

      <Modal open={showModal} onClose={() => setShowModal(false)}>
        <h2 className="text-lg font-extrabold mb-4">Add Exporter</h2>
        <div className="flex flex-col gap-3.5 mb-5">
          <label className="flex flex-col gap-1.5 text-xs font-bold text-slate-500">Name *
            <input className="px-3 py-2.5 rounded-lg border border-slate-300 text-sm" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          </label>
          <label className="flex flex-col gap-1.5 text-xs font-bold text-slate-500">Contact Person
            <input className="px-3 py-2.5 rounded-lg border border-slate-300 text-sm" value={form.contact} onChange={e => setForm(f => ({ ...f, contact: e.target.value }))} />
          </label>
          <label className="flex flex-col gap-1.5 text-xs font-bold text-slate-500">Phone
            <input className="px-3 py-2.5 rounded-lg border border-slate-300 text-sm" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
          </label>
          <label className="flex flex-col gap-1.5 text-xs font-bold text-slate-500">License Number
            <input className="px-3 py-2.5 rounded-lg border border-slate-300 text-sm" value={form.license} onChange={e => setForm(f => ({ ...f, license: e.target.value }))} />
          </label>
        </div>
        <div className="flex justify-end gap-2.5">
          <button onClick={() => setShowModal(false)} className="px-4 py-2 rounded-lg text-sm font-bold bg-slate-100">Cancel</button>
          <button onClick={save} disabled={!form.name.trim()} className={`px-4 py-2 rounded-lg text-sm font-bold text-white ${form.name.trim() ? 'bg-brand-600' : 'bg-slate-300 cursor-not-allowed'}`}>
            Add Exporter
          </button>
        </div>
      </Modal>
    </div>
  );
}
