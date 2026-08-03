export default function BarChart({ data, barColor = 'bg-brand-600' }: { data: { label: string; value: number }[]; barColor?: string }) {
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div className="flex items-end gap-3.5 h-36">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
          <div className="text-[10px] text-slate-500 font-semibold">{d.value}</div>
          <div className={`w-full rounded-t-md ${barColor}`} style={{ height: `${(d.value / max) * 100}%` }} />
          <div className="text-[11px] text-slate-500 font-semibold">{d.label}</div>
        </div>
      ))}
    </div>
  );
}
