export default function MetricCard({ label, value, variant = 'default' }: { label: string; value: string | number; variant?: 'default' | 'primary' | 'warning' }) {
  const styles = {
    default: 'bg-white border border-slate-200 text-slate-900',
    primary: 'bg-brand-600 text-white',
    warning: 'bg-white border border-slate-200 text-amber-600',
  } as const;
  return (
    <div className={`rounded-xl p-5 ${styles[variant]}`}>
      <div className={`text-xs font-bold uppercase tracking-wide mb-2 ${variant === 'primary' ? 'text-indigo-100' : 'text-slate-500'}`}>{label}</div>
      <div className="text-3xl font-extrabold">{value}</div>
    </div>
  );
}
