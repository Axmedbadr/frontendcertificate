import { useApp } from '../context/AppContext';

export default function Animals() {
  const { certificates } = useApp();
  const totals: Record<string, number> = {};
  certificates.forEach(c => {
    const [species, qty] = (c.animals || '').split(' ×');
    if (!species) return;
    totals[species] = (totals[species] || 0) + (Number(qty) || 0);
  });
  return (
    <div className="max-w-3xl grid sm:grid-cols-2 gap-4">
      {Object.entries(totals).map(([species, count]) => (
        <div key={species} className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="text-xs font-bold text-slate-500 uppercase mb-2">{species}</div>
          <div className="text-3xl font-extrabold">{count.toLocaleString()}</div>
        </div>
      ))}
    </div>
  );
}
