import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { QrCode } from 'lucide-react';

export default function CertificateVerify() {
  const { certificates } = useApp();
  const [result, setResult] = useState<typeof certificates[0] | null>(null);

  const simulate = () => setResult(certificates[Math.floor(Math.random() * certificates.length)]);

  return (
    <div className="max-w-xl">
      <div className="bg-white border border-slate-200 rounded-xl p-8 text-center">
        <QrCode size={64} className="mx-auto text-slate-400 mb-4" />
        <p className="text-sm text-slate-500 mb-4">Scan a certificate QR code to verify its authenticity.</p>
        <button onClick={simulate} className="bg-brand-600 text-white px-5 py-2.5 rounded-lg text-sm font-bold">Simulate Scan</button>
        {result && (
          <div className="mt-6 text-left bg-slate-50 rounded-lg p-4 text-sm space-y-1">
            <div><b>Certificate:</b> {result.certificate_number}</div>
            <div><b>Exporter:</b> {result.exporter}</div>
            <div><b>Importer:</b> {result.importer}</div>
            <div><b>Animals:</b> {result.animals}</div>
            <div><b>Issue Date:</b> {result.issue_date}</div>
          </div>
        )}
      </div>
    </div>
  );
}
