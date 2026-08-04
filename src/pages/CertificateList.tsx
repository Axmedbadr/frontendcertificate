import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import CertificatePrint from '../components/CertificatePrint';
import { Certificate, CertStatus } from '../types';
import { Plus } from 'lucide-react';

const filters: (CertStatus | 'all')[] = ['all','draft','submitted','payment_approved','approved','printed','cancelled'];

function DetailRow({ label, value }: { label: string; value?: string | number | null }) {
  const isEmpty = value === undefined || value === null || value === '';
  return (
    <div className="flex justify-between gap-4 py-1 text-sm">
      <span className="text-slate-500">{label}</span>
      <span className={isEmpty ? 'text-slate-400 italic text-right' : 'font-bold text-right'}>
        {isEmpty ? 'Not recorded' : value}
      </span>
    </div>
  );
}

export default function CertificateList() {
  const { certificates, approveCertificate, markCertificatePrinted } = useApp();
  const [filter, setFilter] = useState<CertStatus | 'all'>('all');
  const [detail, setDetail] = useState<Certificate | null>(null);
  const [printTarget, setPrintTarget] = useState<Certificate | null>(null);
  const [approverName, setApproverName] = useState('');
  const navigate = useNavigate();
  const rows = certificates.filter(c => filter === 'all' || c.status === filter);

  useEffect(() => {
    if (!printTarget) return;
    const handleAfterPrint = () => {
      markCertificatePrinted(printTarget);
      setDetail(d => (d && d.id === printTarget.id ? { ...d, status: 'printed' } : d));
      setPrintTarget(null);
    };
    window.addEventListener('afterprint', handleAfterPrint);
    const t = setTimeout(() => window.print(), 50);
    return () => { window.removeEventListener('afterprint', handleAfterPrint); clearTimeout(t); };
  }, [printTarget, markCertificatePrinted]);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex flex-wrap gap-2">
          {filters.map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold ${filter === f ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
              {f === 'all' ? 'All' : f.replace('_',' ')}
            </button>
          ))}
        </div>
        <button onClick={() => navigate('/certificates/new')} className="flex items-center gap-2 bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-bold">
          <Plus size={16} /> New Certificate
        </button>
      </div>
      <div className="bg-white border border-slate-200 rounded-xl overflow-x-auto">
        <table className="w-full text-sm min-w-[720px]">
          <thead>
            <tr className="text-left text-slate-500 border-b border-slate-200">
              <th className="p-3 font-bold">Certificate No.</th>
              <th className="p-3 font-bold">Exporter</th>
              <th className="p-3 font-bold">Importer</th>
              <th className="p-3 font-bold">Animals</th>
              <th className="p-3 font-bold">Status</th>
              <th className="p-3 font-bold">Issue Date</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(c => (
              <tr key={c.id} onClick={() => { setDetail(c); setApproverName(''); }} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 cursor-pointer">
                <td className="p-3 font-bold">{c.certificate_number}</td>
                <td className="p-3">{c.exporter}</td>
                <td className="p-3">{c.importer}</td>
                <td className="p-3">{c.animals}</td>
                <td className="p-3"><StatusBadge status={c.status} /></td>
                <td className="p-3 text-slate-500">{c.issue_date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={!!detail} onClose={() => setDetail(null)} width={560}>
        {detail && (
          <>
            <div className="flex items-start justify-between mb-1">
              <h2 className="text-lg font-extrabold">{detail.certificate_number}</h2>
              <StatusBadge status={detail.status} />
            </div>
            <div className="text-xs text-slate-500 mb-4">Issued {detail.issue_date} by {detail.officer}</div>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 mb-3.5">
              <div className="text-xs font-bold text-slate-500 uppercase mb-1.5">Shipment</div>
              <DetailRow label="Exporter" value={detail.exporter} />
              <DetailRow label="Importer" value={detail.importer} />
              <DetailRow label="Country" value={detail.country} />
              <DetailRow label="Port" value={detail.port} />
              <DetailRow label="Transport" value={detail.transport} />
              <DetailRow label="Loading Place" value={detail.loadingPlace} />
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 mb-3.5">
              <div className="text-xs font-bold text-slate-500 uppercase mb-1.5">Animals</div>
              {(detail.animalRows || []).map((r, i) => (
                <div key={i} className="flex justify-between text-sm py-1">
                  <span>{r.species}{r.breed ? ` (${r.breed})` : ''} × {r.quantity}</span>
                  <span className="font-bold">${(Number(r.quantity) || 0) * (Number(r.rate) || 0)}</span>
                </div>
              ))}
              {!detail.animalRows?.length && <div className="text-sm">{detail.animals}</div>}
              <div className="flex justify-between text-sm font-extrabold pt-2 mt-1.5 border-t border-slate-200">
                <span>Fee Amount</span><span className="text-brand-700">${detail.feeAmount} USD</span>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 mb-3.5">
              <div className="text-xs font-bold text-slate-500 uppercase mb-1.5">Veterinary Checklist</div>
              <DetailRow label="Clinical Examination" value={detail.clinicalExam} />
              <DetailRow label="Quarantine Days" value={detail.quarantineDays} />
              <DetailRow label="Quarantine Place" value={detail.quarantinePlace} />
              <DetailRow label="RVF" value={detail.rvf} />
              <DetailRow label="FMD" value={detail.fmd} />
              <DetailRow label="Brucella" value={detail.brucella} />
              <DetailRow label="Type of Test" value={detail.testType} />
              <DetailRow label="Vaccination" value={detail.vaccination} />
              <DetailRow label="Remarks" value={detail.remarks} />
            </div>

            {(detail.status === 'approved' || detail.status === 'printed') && (
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 mb-3.5">
                <div className="text-xs font-bold text-slate-500 uppercase mb-1.5">Approval</div>
                <DetailRow label="Approved By" value={detail.approvedBy} />
                <DetailRow label="Approval Date" value={detail.approvalDate} />
              </div>
            )}

            <div>
              <div className="text-xs font-bold text-slate-500 uppercase mb-1.5">Payment Voucher</div>
              {detail.voucherDataUrl ? (
                <a href={detail.voucherDataUrl} download={detail.voucherFileName} className="block border border-slate-200 rounded-lg overflow-hidden">
                  <img src={detail.voucherDataUrl} alt={detail.voucherFileName} className="w-full max-h-56 object-contain bg-slate-50" />
                </a>
              ) : (
                <div className="text-sm text-slate-400 italic border border-dashed border-slate-300 rounded-lg p-3 text-center">No voucher uploaded</div>
              )}
            </div>

            {detail.status === 'payment_approved' && (
              <label className="flex flex-col gap-1.5 text-xs font-bold text-slate-500 mb-3.5">Approving Veterinary Officer *
                <input
                  className="px-3 py-2.5 rounded-lg border border-slate-300 text-sm font-normal"
                  placeholder="Enter officer's full name"
                  value={approverName}
                  onChange={e => setApproverName(e.target.value)}
                />
              </label>
            )}

            <div className="flex justify-end gap-2.5 mt-5">
              <button onClick={() => setDetail(null)} className="px-4 py-2 rounded-lg text-sm font-bold bg-slate-100">Close</button>
              {detail.status === 'payment_approved' && (
                <button
                  onClick={() => {
                    approveCertificate(detail, approverName.trim());
                    setDetail(d => d ? { ...d, status: 'approved', approvedBy: approverName.trim(), approvalDate: new Date().toISOString().slice(0, 10) } : d);
                  }}
                  disabled={!approverName.trim()}
                  className={`px-4 py-2 rounded-lg text-sm font-bold text-white ${approverName.trim() ? 'bg-brand-600' : 'bg-slate-300 cursor-not-allowed'}`}
                >Approve Certificate</button>
              )}
              {detail.status === 'approved' && (
                <button
                  onClick={() => setPrintTarget(detail)}
                  className="px-4 py-2 rounded-lg text-sm font-bold text-white bg-brand-600"
                >Print Certificate</button>
              )}
            </div>
          </>
        )}
      </Modal>

      {printTarget && <CertificatePrint cert={printTarget} />}
    </div>
  );
}
