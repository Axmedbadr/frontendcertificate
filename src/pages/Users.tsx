import { useState } from 'react';
import { useApp } from '../context/AppContext';
import Modal from '../components/Modal';
import MetricCard from '../components/MetricCard';
import { Role, UserEntity } from '../types';
import { Plus, Pencil } from 'lucide-react';

const roleOptions: Role[] = ['Admin', 'Veterinary Officer', 'Data Entry Clerk', 'Finance Officer', 'Data Field Collector', 'Observer'];
const emptyForm = { name: '', email: '', role: 'Data Entry Clerk' as Role, status: 'active' as UserEntity['status'] };

export default function Users() {
  const { users, addUser, updateUser } = useApp();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<Role | 'all'>('all');
  const [editing, setEditing] = useState<UserEntity | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [showModal, setShowModal] = useState(false);

  const filtered = users.filter(u =>
    (roleFilter === 'all' || u.role === roleFilter) &&
    (u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()))
  );

  const openAdd = () => { setEditing(null); setForm(emptyForm); setShowModal(true); };
  const openEdit = (u: UserEntity) => { setEditing(u); setForm({ name: u.name, email: u.email, role: u.role, status: u.status }); setShowModal(true); };

  const save = () => {
    if (!form.name.trim() || !form.email.trim()) return;
    if (editing) updateUser(editing.id, form);
    else addUser({ id: Date.now(), ...form });
    setShowModal(false);
  };

  const toggleStatus = (u: UserEntity) => updateUser(u.id, { status: u.status === 'active' ? 'inactive' : 'active' });

  const roleCounts = roleOptions.map(r => ({ role: r, count: users.filter(u => u.role === r).length })).filter(rc => rc.count > 0);

  return (
    <div className="max-w-4xl">
      <div className="grid grid-cols-3 gap-4 mb-5">
        <MetricCard label="Total Users" value={users.length} variant="primary" />
        <MetricCard label="Active" value={users.filter(u => u.status === 'active').length} />
        <MetricCard label="Inactive" value={users.filter(u => u.status === 'inactive').length} variant="warning" />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex flex-wrap items-center gap-2">
          <input
            placeholder="Search name or email…"
            className="px-3 py-2 rounded-lg border border-slate-300 text-sm w-56"
            value={search} onChange={e => setSearch(e.target.value)}
          />
          <select className="px-3 py-2 rounded-lg border border-slate-300 text-sm" value={roleFilter} onChange={e => setRoleFilter(e.target.value as Role | 'all')}>
            <option value="all">All Roles</option>
            {roleOptions.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-bold">
          <Plus size={16} /> Add User
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-x-auto mb-6">
        <table className="w-full text-sm min-w-[640px]">
          <thead><tr className="text-left text-slate-500 border-b border-slate-200">
            <th className="p-3 font-bold">Name</th><th className="p-3 font-bold">Email</th><th className="p-3 font-bold">Role</th><th className="p-3 font-bold">Status</th><th className="p-3 font-bold"></th>
          </tr></thead>
          <tbody>
            {filtered.map(u => (
              <tr key={u.id} className="border-b border-slate-100 last:border-0">
                <td className="p-3 font-bold">{u.name}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3">{u.role}</td>
                <td className="p-3">
                  <button onClick={() => toggleStatus(u)} className={`px-2.5 py-1 rounded-md text-xs font-bold ${u.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                    {u.status}
                  </button>
                </td>
                <td className="p-3 text-right">
                  <button onClick={() => openEdit(u)} className="text-slate-400 hover:text-brand-600"><Pencil size={16} /></button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={5} className="p-6 text-center text-slate-400">No users match.</td></tr>}
          </tbody>
        </table>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-5">
        <h3 className="text-sm font-bold mb-3">Users by Role</h3>
        <div className="flex flex-wrap gap-2">
          {roleCounts.map(rc => (
            <span key={rc.role} className="px-3 py-1.5 rounded-lg bg-slate-100 text-xs font-bold text-slate-600">{rc.role}: {rc.count}</span>
          ))}
        </div>
      </div>

      <Modal open={showModal} onClose={() => setShowModal(false)}>
        <h2 className="text-lg font-extrabold mb-4">{editing ? 'Edit User' : 'Add User'}</h2>
        <div className="flex flex-col gap-3.5 mb-5">
          <label className="flex flex-col gap-1.5 text-xs font-bold text-slate-500">Name
            <input className="px-3 py-2.5 rounded-lg border border-slate-300 text-sm" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          </label>
          <label className="flex flex-col gap-1.5 text-xs font-bold text-slate-500">Email
            <input type="email" className="px-3 py-2.5 rounded-lg border border-slate-300 text-sm" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
          </label>
          <label className="flex flex-col gap-1.5 text-xs font-bold text-slate-500">Role
            <select className="px-3 py-2.5 rounded-lg border border-slate-300 text-sm" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value as Role }))}>
              {roleOptions.map(r => <option key={r}>{r}</option>)}
            </select>
          </label>
          <label className="flex flex-col gap-1.5 text-xs font-bold text-slate-500">Status
            <select className="px-3 py-2.5 rounded-lg border border-slate-300 text-sm" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as UserEntity['status'] }))}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </label>
        </div>
        <div className="flex justify-end gap-2.5">
          <button onClick={() => setShowModal(false)} className="px-4 py-2 rounded-lg text-sm font-bold bg-slate-100">Cancel</button>
          <button onClick={save} disabled={!form.name.trim() || !form.email.trim()} className={`px-4 py-2 rounded-lg text-sm font-bold text-white ${form.name.trim() && form.email.trim() ? 'bg-brand-600' : 'bg-slate-300 cursor-not-allowed'}`}>
            {editing ? 'Save Changes' : 'Add User'}
          </button>
        </div>
      </Modal>
    </div>
  );
}
