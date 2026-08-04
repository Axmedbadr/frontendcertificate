import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp, emptyAnimalRow } from '../context/AppContext';
import { AnimalRow, Certificate } from '../types';
import { X } from 'lucide-react';

const speciesOptions = ['Cattle', 'Sheep', 'Goat', 'Camel'];
const testTypeOptions = ['ELISA', 'PCR', 'Serological', 'Rose Bengal'];
const quarantinePlaceOptions = [
  'Saudi Emirates livestock quarantine',
  'Berbera union animal quarantine',
  'berbera National quarantine',
  'KSA international livestock quarantine center Berbera',
];

export default function FieldCollector() {
  const { t, addCertificate, speciesRates } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    exporter: '', importer: '', country: '', port: '', transport: '', loadingPlace: '',
    clinicalExam: '', quarantineDays: '', quarantinePlace: '', rvf: '', fmd: '', brucella: '',
    vaccination: '', remarks: '',
  });
  const [testTypes, setTestTypes] = useState<string[]>([]);
  const toggleTestType = (opt: string) =>
    setTestTypes(prev => prev.includes(opt) ? prev.filter(o => o !== opt) : [...prev, opt]);
  const [rates, setRates] = useState<Record<string, number>>({ ...speciesRates });
  const [rows, setRows] = useState<AnimalRow[]>([emptyAnimalRow()]);
  const [voucherFile, setVoucherFile] = useState<File | null>(null);
  const [voucherDataUrl, setVoucherDataUrl] = useState<string | null>(null);

  const onVoucherChange = (file: File | null) => {
    setVoucherFile(file);
    if (!file) { setVoucherDataUrl(null); return; }
    const reader = new FileReader();
    reader.onload = () => setVoucherDataUrl(reader.result as string);
    reader.readAsDataURL(file);
  };

  const updateRow = (i: number, key: keyof AnimalRow, val: string) =>
    setRows(prev => prev.map((r, idx) => idx === i ? { ...r, [key]: val } : r));
  const removeRow = (i: number) => setRows(prev => prev.length > 1 ? prev.filter((_, idx) => idx !== i) : prev);
  const addRow = () => setRows(prev => [...prev, emptyAnimalRow()]);

  const breakdown = rows.filter(r => r.species && r.quantity).map(r => {
    const rate = rates[r.species] || 0;
    const qty = Number(r.quantity) || 0;
    return { ...r, rate, subtotal: qty * rate };
  });
  const totalQty = rows.reduce((a, r) => a + (Number(r.quantity) || 0), 0);
  const totalFee = breakdown.reduce((a, r) => a + r.subtotal, 0);

  const submit = () => {
    const validRows = rows.filter(r => r.species && r.quantity);
    if (!form.exporter || !form.importer || !form.country || !form.port || validRows.length === 0) {
      alert('Please fill in Exporter, Importer, Country, Port, and at least one animal row.');
      return;
    }
    if (!form.quarantinePlace) {
      alert('Please select a Quarantine Place.');
      return;
    }
    const first = validRows[0];
    const cert: Certificate = {
      id: Date.now(),
      certificate_number: 'LCS-2026-0' + (150 + Math.floor(Math.random() * 50)),
      exporter: form.exporter, importer: form.importer, country: form.country,
      port: form.port, transport: form.transport, loadingPlace: form.loadingPlace,
      animals: validRows.map(r => `${r.species} ×${r.quantity}`).join(', '),
      animalRows: validRows.map(r => ({ ...r, rate: String(rates[r.species] || 0) })),
      status: 'submitted', issue_date: new Date().toISOString().slice(0,10), officer: 'Field Collector',
      breed: first.breed, sex: first.sex, age: first.age, earTag: first.earTag,
      quarantineDays: form.quarantineDays, quarantinePlace: form.quarantinePlace,
      rvf: form.rvf, fmd: form.fmd, brucella: form.brucella, testType: testTypes.join(', '),
      vaccination: form.vaccination, clinicalExam: form.clinicalExam, remarks: form.remarks,
      feeAmount: totalFee,
      voucherFileName: voucherFile?.name, voucherDataUrl: voucherDataUrl || undefined,
    };
    addCertificate(cert);
    setForm({ exporter:'', importer:'', country:'', port:'', transport:'', loadingPlace:'', clinicalExam:'', quarantineDays:'', quarantinePlace:'', rvf:'', fmd:'', brucella:'', vaccination:'', remarks:'' });
    setTestTypes([]);
    setRows([emptyAnimalRow()]);
    onVoucherChange(null);
    navigate('/field-collector/history', { state: { justSubmitted: cert.certificate_number } });
  };

  const inputCls = 'px-2.5 py-2 rounded-lg border border-slate-300 text-sm w-full';
  const labelCls = 'flex flex-col gap-1.5 text-xs font-bold text-slate-500';

  return (
    <div className="max-w-3xl flex flex-col gap-4">
      <div className="bg-white border border-slate-200 rounded-xl p-5">
        <h3 className="text-sm font-bold mb-3.5">{t.fcCustomerInfo}</h3>
        <div className="grid sm:grid-cols-2 gap-3.5">
          <label className={labelCls}>{t.fieldExporter}
            <select className={inputCls} value={form.exporter} onChange={e => setForm(f => ({ ...f, exporter: e.target.value }))}>
              <option value="">—</option><option>Horn Exports Co.</option><option>Al-Amin Livestock Trading</option><option>Berbera Livestock Ltd</option><option>Golden Gate Traders</option>
            </select>
          </label>
          <label className={labelCls}>{t.fieldImporter}
            <select className={inputCls} value={form.importer} onChange={e => setForm(f => ({ ...f, importer: e.target.value }))}>
              <option value="">—</option><option>Al Rajhi Trading (Saudi Arabia)</option><option>Gulf Livestock Imports (UAE)</option><option>Jeddah Animal Market</option>
            </select>
          </label>
          <label className={labelCls}>{t.fieldCountry}
            <select className={inputCls} value={form.country} onChange={e => setForm(f => ({ ...f, country: e.target.value }))}>
              <option value="">—</option><option>Saudi Arabia</option><option>UAE</option>
            </select>
          </label>
          <label className={labelCls}>{t.fieldPort}
            <select className={inputCls} value={form.port} onChange={e => setForm(f => ({ ...f, port: e.target.value }))}>
              <option value="">—</option><option>Berbera Port</option><option>Bosaso Port</option>
            </select>
          </label>
          <label className={labelCls}>{t.fieldTransport}
            <select className={inputCls} value={form.transport} onChange={e => setForm(f => ({ ...f, transport: e.target.value }))}>
              <option value="">—</option><option>Sea Vessel</option><option>Truck</option>
            </select>
          </label>
          <label className={labelCls}>{t.fieldLoadingPlace}
            <input className={inputCls} value={form.loadingPlace} onChange={e => setForm(f => ({ ...f, loadingPlace: e.target.value }))} />
          </label>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-5">
        <h3 className="text-sm font-bold mb-3.5">{t.fcAnimalInfo}</h3>
        {rows.map((row, i) => (
          <div key={i} className="grid sm:grid-cols-3 gap-2.5 mb-3 pb-3 border-b border-slate-100 last:border-0">
            <label className={labelCls}>{t.fieldSpecies}
              <select className={inputCls} value={row.species} onChange={e => updateRow(i, 'species', e.target.value)}>
                <option value="">—</option>{speciesOptions.map(s => <option key={s}>{s}</option>)}
              </select>
            </label>
            <label className={labelCls}>{t.fieldBreed}
              <input className={inputCls} value={row.breed} onChange={e => updateRow(i, 'breed', e.target.value)} />
            </label>
            <label className={labelCls}>{t.fieldSex}
              <select className={inputCls} value={row.sex} onChange={e => updateRow(i, 'sex', e.target.value)}>
                <option value="">—</option><option value="Male">{t.male}</option><option value="Female">{t.female}</option><option value="Mixed">{t.mixed}</option>
              </select>
            </label>
            <label className={labelCls}>{t.fieldAge}
              <input className={inputCls} value={row.age} onChange={e => updateRow(i, 'age', e.target.value)} />
            </label>
            <label className={labelCls}>{t.fieldEarTag}
              <input className={inputCls} value={row.earTag} onChange={e => updateRow(i, 'earTag', e.target.value)} />
            </label>
            <div className="grid grid-cols-[1fr_auto] gap-2 items-end">
              <label className={labelCls}>{t.fieldQuantity}
                <input type="number" className={inputCls} value={row.quantity} onChange={e => updateRow(i, 'quantity', e.target.value)} />
              </label>
              <button onClick={() => removeRow(i)} className="text-red-500 font-bold pb-2.5"><X size={16} /></button>
            </div>
          </div>
        ))}
        <button onClick={addRow} className="text-brand-600 font-bold text-xs">+ {t.fcAddSpecies}</button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-5">
        <h3 className="text-sm font-bold mb-3.5">{t.step3Title}</h3>
        <div className="grid sm:grid-cols-3 gap-3.5">
          <label className={labelCls}>{t.fieldClinicalExam}
            <select className={inputCls} value={form.clinicalExam} onChange={e => setForm(f => ({ ...f, clinicalExam: e.target.value }))}>
              <option value="">—</option><option>Passed</option><option>Failed</option>
            </select>
          </label>
          <label className={labelCls}>{t.fieldQuarantineDays}
            <input type="number" className={inputCls} value={form.quarantineDays} onChange={e => setForm(f => ({ ...f, quarantineDays: e.target.value }))} />
          </label>
          <label className={labelCls}>{t.fieldQuarantinePlace} *
            <select className={inputCls} value={form.quarantinePlace} onChange={e => setForm(f => ({ ...f, quarantinePlace: e.target.value }))}>
              <option value="">—</option>
              {quarantinePlaceOptions.map(q => <option key={q}>{q}</option>)}
            </select>
          </label>
          <label className={labelCls}>{t.fieldRVF}
            <select className={inputCls} value={form.rvf} onChange={e => setForm(f => ({ ...f, rvf: e.target.value }))}>
              <option value="">—</option><option>Negative</option><option>Positive</option>
            </select>
          </label>
          <label className={labelCls}>{t.fieldFMD}
            <select className={inputCls} value={form.fmd} onChange={e => setForm(f => ({ ...f, fmd: e.target.value }))}>
              <option value="">—</option><option>Negative</option><option>Positive</option>
            </select>
          </label>
          <label className={labelCls}>{t.fieldBrucella}
            <select className={inputCls} value={form.brucella} onChange={e => setForm(f => ({ ...f, brucella: e.target.value }))}>
              <option value="">—</option><option>Negative</option><option>Positive</option>
            </select>
          </label>
          <div className={`${labelCls} sm:col-span-2`}>{t.fieldTestType}
            <div className="flex flex-wrap gap-1.5">
              {testTypeOptions.map(opt => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => toggleTestType(opt)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold border ${testTypes.includes(opt) ? 'bg-brand-600 text-white border-brand-600' : 'bg-white text-slate-600 border-slate-300'}`}
                >{opt}</button>
              ))}
            </div>
          </div>
          <label className={labelCls}>{t.fieldVaccination}
            <select className={inputCls} value={form.vaccination} onChange={e => setForm(f => ({ ...f, vaccination: e.target.value }))}>
              <option value="">—</option><option>Vaccinated</option><option>Not Vaccinated</option>
            </select>
          </label>
          <label className={`${labelCls} sm:col-span-3`}>{t.fieldRemarks}
            <textarea className={`${inputCls} min-h-[60px] resize-y`} value={form.remarks} onChange={e => setForm(f => ({ ...f, remarks: e.target.value }))} />
          </label>
        </div>
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
        <h3 className="text-sm font-bold mb-1">{t.fcFeeCheck}</h3>
        <p className="text-xs text-slate-500 mb-3.5">{t.fcFeeCheckHint}</p>
        {breakdown.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-lg p-3 mb-3.5">
            <div className="grid grid-cols-4 gap-2 text-[10px] font-bold text-slate-500 uppercase pb-2 mb-1.5 border-b border-slate-100">
              <span>{t.fieldSpecies}</span><span>{t.fieldQuantity}</span><span>{t.fieldFeePerHead}</span><span>{t.fcCalcTotal}</span>
            </div>
            {breakdown.map((r, i) => (
              <div key={i} className="grid grid-cols-4 gap-2 text-sm items-center py-1">
                <span>{r.species}</span>
                <span className="font-bold">× {r.quantity}</span>
                <input type="number" className="px-2 py-1 rounded-md border border-slate-300 text-xs w-full" value={r.rate}
                  onChange={e => setRates(prev => ({ ...prev, [r.species]: Number(e.target.value) }))} />
                <span className="font-bold text-brand-700">${r.subtotal}</span>
              </div>
            ))}
          </div>
        )}
        <div className="grid sm:grid-cols-2 gap-3.5">
          <div className={labelCls}>{t.fieldQuantity}
            <div className="px-2.5 py-2 rounded-lg border border-slate-300 bg-white text-sm">{totalQty}</div>
          </div>
          <div className={labelCls}>{t.fcCalcTotal}
            <div className="px-2.5 py-2 rounded-lg border border-brand-300 bg-brand-50 text-sm font-extrabold text-brand-700">${totalFee} USD</div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-5">
        <h3 className="text-sm font-bold mb-3.5">{t.fcDocuments}</h3>
        <div className="grid sm:grid-cols-2 gap-3.5">
          <div className="flex flex-col gap-1.5">
            <div className="text-xs font-bold text-slate-500">{t.fcUploadDocs}</div>
            <div className="h-28 border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center text-xs text-slate-400">Drop required documents</div>
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="text-xs font-bold text-slate-500">{t.fcUploadVoucher} *</div>
            <label className="h-28 border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center text-xs text-slate-400 cursor-pointer overflow-hidden">
              {voucherDataUrl ? (
                <img src={voucherDataUrl} alt={voucherFile?.name} className="h-full w-full object-contain" />
              ) : voucherFile ? voucherFile.name : 'Drop payment voucher'}
              <input type="file" accept="image/*,.pdf" className="hidden" onChange={e => onVoucherChange(e.target.files?.[0] || null)} />
            </label>
          </div>
        </div>
      </div>

      <button onClick={submit} className="bg-brand-600 text-white px-6 py-3 rounded-lg text-sm font-bold self-start">Submit Application</button>
    </div>
  );
}
