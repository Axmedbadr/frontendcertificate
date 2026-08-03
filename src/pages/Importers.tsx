import { useApp } from '../context/AppContext';

export default function Importers() {
  const { importers } = useApp();
  return (
    <div className="max-w-4xl">
      <div className="bg-white border border-slate-200 rounded-xl overflow-x-auto">
        <table className="w-full text-sm min-w-[560px]">
          <thead><tr className="text-left text-slate-500 border-b border-slate-200">
            <th className="p-3 font-bold">Name</th><th className="p-3 font-bold">Country</th><th className="p-3 font-bold">Contact</th><th className="p-3 font-bold">Phone</th>
          </tr></thead>
          <tbody>
            {importers.map(i => (
              <tr key={i.id} className="border-b border-slate-100 last:border-0">
                <td className="p-3 font-bold">{i.name}</td><td className="p-3">{i.country}</td><td className="p-3">{i.contact}</td><td className="p-3">{i.phone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
