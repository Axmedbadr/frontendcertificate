import { useState } from 'react';
import { useApp } from '../context/AppContext';
import Modal from '../components/Modal';
import { Certificate, AccountName } from '../types';

const accountOptions: AccountName[] = ['Darasalam Bank Account', 'Dahabshiil Bank Account'];

export default function Payments() {
  const { certificates, verifyPayment, auditLog } = useApp();
  const [target, setTarget] = useState<Certificate | null>(null);
  const [account, setAccount] = useState<AccountName | ''>('');

  const pendingCerts = certificates.filter(c => c.status === 'submitted');

  const confirm = () => {
    if (!target || !account) return;
    verifyPayment(target, account);
    setTarget(null); setAccount('');
  };

  return (
    <div className="max-w-4xl">
      <h3 className="text-sm font-bold mb-3">Awaiting Payment Verification</h3>
      <div className="bg-white border border-slate-200 rounded-xl overflow-x-auto mb-8">
        <table className="w-full text-sm min-w-[600px]">
          <thead><tr className="text-left text-slate-500 border-b border-slate-200">
            <th className="p-3 font-bold">Certificate</th><th className="p-3 font-bold">Exporter</th><th className="p-3 font-bold">Fee</th><th className="p-3 font-bold"></th>
          </tr></thead>
          <tbody>
            {pendingCerts.map(c => (
              <tr key={c.id} className="border-b border-slate-100 last:border-0">
                <td className="p-3 font-bold">{c.certificate_number}</td>
                <td className="p-3">{c.exporter}</td>
                <td className="p-3">${c.feeAmount}</td>
                <td className="p-3"><button onClick={() => setTarget(c)} className="bg-brand-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold">Verify Payment</button></td>
              </tr>
            ))}
            {pendingCerts.length === 0 && <tr><td colSpan={4} className="p-6 text-center text-slate-400">No payments awaiting verification.</td></tr>}
          </tbody>
        </table>
      </div>

      <h3 className="text-sm font-bold mb-3">Audit Trail</h3>
      <div className="bg-white border border-slate-200 rounded-xl divide-y divide-slate-100">
        {auditLog.map(a => (
          <div key={a.id} className="p-3 text-sm flex justify-between">
            <span>{a.text}</span><span className="text-slate-400 text-xs">{new Date(a.date).toLocaleString()}</span>
          </div>
        ))}
        {auditLog.length === 0 && <div className="p-6 text-center text-slate-400 text-sm">No transactions yet.</div>}
      </div>

      <Modal open={!!target} onClose={() => setTarget(null)}>
        {target && (
          <>
            <h2 className="text-lg font-extrabold mb-1">Verify Payment</h2>
            <div className="text-xs text-slate-500 mb-4">{target.certificate_number} · {target.exporter}</div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 mb-4">
              <div className="text-xs font-bold text-slate-500 uppercase mb-2">Animals</div>
              {(target.animalRows || []).map((r, i) => (
                <div key={i} className="flex justify-between text-sm py-1">
                  <span>{r.species}{r.breed ? ` (${r.breed})` : ''} × {r.quantity}</span>
                  <span className="font-bold">${(Number(r.quantity) || 0) * (Number(r.rate) || 0)}</span>
                </div>
              ))}
              <div className="flex justify-between text-sm font-extrabold pt-2 mt-1.5 border-t border-slate-200">
                <span>Expected Total</span><span className="text-brand-700">${target.feeAmount} USD</span>
              </div>
            </div>
            <div className="mb-3.5">
              <div className="text-xs font-bold text-slate-500 uppercase mb-1.5">Payment Voucher</div>
              {target.voucherDataUrl ? (
                <a href={target.voucherDataUrl} download={target.voucherFileName} className="block border border-slate-200 rounded-lg overflow-hidden">
                  <img src={target.voucherDataUrl} alt={target.voucherFileName} className="w-full max-h-56 object-contain bg-slate-50" />
                </a>
              ) : (
                <div className="text-sm text-slate-400 italic border border-dashed border-slate-300 rounded-lg p-3 text-center">No voucher uploaded</div>
              )}
            </div>
            <p className="text-sm text-slate-500 mb-3.5">Confirm the payment voucher matches the amount above, then select the account funds were received into.</p>
            <label className="flex flex-col gap-1.5 text-xs font-bold text-slate-500 mb-5">Received Account *
              <select className="px-3 py-2.5 rounded-lg border border-slate-300 text-sm" value={account} onChange={e => setAccount(e.target.value as AccountName)}>
                <option value="">—</option>
                {accountOptions.map(a => <option key={a}>{a}</option>)}
              </select>
            </label>
            <div className="flex justify-end gap-2.5">
              <button onClick={() => setTarget(null)} className="px-4 py-2 rounded-lg text-sm font-bold bg-slate-100">Close</button>
              <button onClick={confirm} disabled={!account} className={`px-4 py-2 rounded-lg text-sm font-bold text-white ${account ? 'bg-brand-600' : 'bg-slate-300 cursor-not-allowed'}`}>Approve Payment</button>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}
