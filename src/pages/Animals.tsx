import { useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import MetricCard from '../components/MetricCard';
import BarChart from '../components/BarChart';
import StatusBadge from '../components/StatusBadge';
import { Beef, PawPrint, Search } from 'lucide-react';

const speciesStyle: Record<string, { badge: string; icon: React.ReactNode }> = {
  Cattle: { badge: 'bg-amber-100 text-amber-700', icon: <Beef size={20} /> },
  Sheep: { badge: 'bg-sky-100 text-sky-700', icon: <PawPrint size={20} /> },
  Goat: { badge: 'bg-emerald-100 text-emerald-700', icon: <PawPrint size={20} /> },
  Camel: { badge: 'bg-orange-100 text-orange-700', icon: <PawPrint size={20} /> },
};
const fallbackStyle = { badge: 'bg-slate-100 text-slate-600', icon: <PawPrint size={20} /> };

export default function Animals() {
  const { certificates } = useApp();
  const [speciesFilter, setSpeciesFilter] = useState<string>('all');
  const [search, setSearch] = useState('');

  const entries = useMemo(() => certificates.flatMap(c =>
    (c.animalRows || []).map((r, i) => ({
      key: `${c.id}-${i}`, ...r,
      certNumber: c.certificate_number, exporter: c.exporter, importer: c.importer,
      status: c.status, issueDate: c.issue_date,
    }))
  ), [certificates]);

  const speciesList = useMemo(() => Array.from(new Set(entries.map(e => e.species))).sort(), [entries]);

  const speciesStats = useMemo(() => speciesList.map(sp => {
    const rows = entries.filter(e => e.species === sp);
    const total = rows.reduce((a, r) => a + (Number(r.quantity) || 0), 0);
    const shipments = new Set(rows.map(r => r.certNumber)).size;
    const breedTotals = new Map<string, number>();
    rows.forEach(r => { if (r.breed) breedTotals.set(r.breed, (breedTotals.get(r.breed) || 0) + (Number(r.quantity) || 0)); });
    const topBreed = Array.from(breedTotals.entries()).sort((a, b) => b[1] - a[1])[0];
    return { species: sp, total, shipments, topBreed: topBreed?.[0] };
  }), [entries, speciesList]);

  const totalAnimals = speciesStats.reduce((a, s) => a + s.total, 0);
  const totalShipments = new Set(entries.map(e => e.certNumber)).size;

  const filtered = entries.filter(e =>
    (speciesFilter === 'all' || e.species === speciesFilter) &&
    (e.certNumber.toLowerCase().includes(search.toLowerCase()) ||
      e.exporter.toLowerCase().includes(search.toLowerCase()) ||
      (e.breed || '').toLowerCase().includes(search.toLowerCase()) ||
      (e.earTag || '').toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="max-w-5xl">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard label="Total Animals" value={totalAnimals.toLocaleString()} variant="primary" />
        <MetricCard label="Species Tracked" value={speciesList.length} />
        <MetricCard label="Shipments" value={totalShipments} />
        <MetricCard label="Avg. Herd Size" value={totalShipments ? Math.round(totalAnimals / totalShipments).toLocaleString() : 0} />
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {speciesStats.map(s => {
          const style = speciesStyle[s.species] || fallbackStyle;
          const pct = totalAnimals ? Math.round((s.total / totalAnimals) * 100) : 0;
          return (
            <div key={s.species} className="bg-white border border-slate-200 rounded-xl p-5">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${style.badge}`}>
                {style.icon}
              </div>
              <div className="text-xs font-bold text-slate-500 uppercase mb-1">{s.species}</div>
              <div className="text-3xl font-extrabold mb-2">{s.total.toLocaleString()}</div>
              <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden mb-2">
                <div className={`h-full rounded-full ${style.badge.split(' ')[0]}`} style={{ width: `${pct}%` }} />
              </div>
              <div className="text-xs text-slate-500">{pct}% of herd · {s.shipments} shipment{s.shipments !== 1 ? 's' : ''}</div>
              {s.topBreed && <div className="text-xs text-slate-400 mt-1">Top breed: {s.topBreed}</div>}
            </div>
          );
        })}
        {speciesStats.length === 0 && (
          <div className="col-span-full text-center text-slate-400 py-8 bg-white border border-slate-200 rounded-xl">No animal data yet.</div>
        )}
      </div>

      {speciesStats.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 mb-6">
          <h3 className="text-sm font-bold mb-4">Species Distribution</h3>
          <BarChart data={speciesStats.map(s => ({ label: s.species, value: s.total }))} />
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2 mb-4">
        <button onClick={() => setSpeciesFilter('all')} className={`px-3 py-1.5 rounded-lg text-xs font-bold ${speciesFilter === 'all' ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600'}`}>All</button>
        {speciesList.map(sp => (
          <button key={sp} onClick={() => setSpeciesFilter(sp)} className={`px-3 py-1.5 rounded-lg text-xs font-bold ${speciesFilter === sp ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600'}`}>{sp}</button>
        ))}
        <div className="relative ml-auto">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            placeholder="Search certificate, exporter, breed, ear tag…"
            className="pl-8 pr-3 py-1.5 rounded-lg border border-slate-300 text-xs w-64"
            value={search} onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-x-auto">
        <table className="w-full text-sm min-w-[820px]">
          <thead>
            <tr className="text-left text-slate-500 border-b border-slate-200">
              <th className="p-3 font-bold">Certificate No.</th>
              <th className="p-3 font-bold">Species</th>
              <th className="p-3 font-bold">Breed</th>
              <th className="p-3 font-bold">Sex</th>
              <th className="p-3 font-bold">Age</th>
              <th className="p-3 font-bold">Ear Tag</th>
              <th className="p-3 font-bold text-right">Quantity</th>
              <th className="p-3 font-bold">Exporter</th>
              <th className="p-3 font-bold">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(e => {
              const style = speciesStyle[e.species] || fallbackStyle;
              return (
                <tr key={e.key} className="border-b border-slate-100 last:border-0">
                  <td className="p-3 font-bold">{e.certNumber}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-md text-xs font-bold ${style.badge}`}>{e.species}</span>
                  </td>
                  <td className="p-3">{e.breed || '—'}</td>
                  <td className="p-3">{e.sex || '—'}</td>
                  <td className="p-3">{e.age || '—'}</td>
                  <td className="p-3">{e.earTag || '—'}</td>
                  <td className="p-3 text-right font-bold">{e.quantity}</td>
                  <td className="p-3">{e.exporter}</td>
                  <td className="p-3"><StatusBadge status={e.status} /></td>
                </tr>
              );
            })}
            {filtered.length === 0 && <tr><td colSpan={9} className="p-6 text-center text-slate-400">No animals match.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
