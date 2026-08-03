import { useApp } from '../context/AppContext';

export default function Exporters() {
  const { exporters } = useApp();
  return (
    <div className="max-w-4xl">
      <div className="bg-white border border-slate-200 rounded-xl overflow-x-auto">
        <table className="w-full text-sm min-w-[560px]">
          <thead><tr className="text-left text-slate-500 border-b border-slate-200">
            <th className="p-3 font-bold">Name</th><th className="p-3 font-bold">Contact</th><th className="p-3 font-bold">Phone</th><th className="p-3 font-bold">License</th>
          </tr></thead>
          <tbody>
            {exporters.map(e => (
              <tr key={e.id} className="border-b border-slate-100 last:border-0">
                <td className="p-3 font-bold">{e.name}</td><td className="p-3">{e.contact}</td><td className="p-3">{e.phone}</td><td className="p-3">{e.license}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
