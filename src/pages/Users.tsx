import { useApp } from '../context/AppContext';

export default function Users() {
  const { users } = useApp();
  return (
    <div className="max-w-4xl">
      <div className="bg-white border border-slate-200 rounded-xl overflow-x-auto">
        <table className="w-full text-sm min-w-[600px]">
          <thead><tr className="text-left text-slate-500 border-b border-slate-200">
            <th className="p-3 font-bold">Name</th><th className="p-3 font-bold">Email</th><th className="p-3 font-bold">Role</th><th className="p-3 font-bold">Status</th>
          </tr></thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} className="border-b border-slate-100 last:border-0">
                <td className="p-3 font-bold">{u.name}</td><td className="p-3">{u.email}</td><td className="p-3">{u.role}</td>
                <td className="p-3"><span className={`px-2.5 py-1 rounded-md text-xs font-bold ${u.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{u.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
