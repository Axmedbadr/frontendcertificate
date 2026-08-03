import { CertStatus } from '../types';

const meta: Record<CertStatus, { bg: string; color: string; label: string }> = {
  draft: { bg: 'bg-slate-100', color: 'text-slate-600', label: 'Draft' },
  submitted: { bg: 'bg-amber-100', color: 'text-amber-700', label: 'Submitted' },
  payment_approved: { bg: 'bg-sky-100', color: 'text-sky-700', label: 'Payment Approved' },
  approved: { bg: 'bg-emerald-100', color: 'text-emerald-700', label: 'Approved' },
  printed: { bg: 'bg-indigo-100', color: 'text-indigo-700', label: 'Printed' },
  cancelled: { bg: 'bg-red-100', color: 'text-red-700', label: 'Cancelled' },
};

export default function StatusBadge({ status }: { status: CertStatus }) {
  const m = meta[status];
  return <span className={`inline-block px-2.5 py-1 rounded-md text-xs font-bold ${m.bg} ${m.color}`}>{m.label}</span>;
}
