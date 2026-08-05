import { Certificate } from '../types';
import { somaliaEmblemDataUri } from '../assets/somaliaEmblemDataUri';
import { QrCode } from 'lucide-react';

const cellCls = 'border border-slate-800 p-1.5 align-top';
const th = 'border border-slate-800 p-1 text-left';

function FieldCell({ en, ar, value }: { en: string; ar: string; value?: string }) {
  return (
    <td className={cellCls}>
      <div className="font-bold text-[11px]">{en}</div>
      <div dir="rtl" className="text-[11px]">{ar}</div>
      <div className="mt-2 min-h-[14px] text-[11px]">{value || ' '}</div>
    </td>
  );
}

function StatementRow({ n, en, ar }: { n: number; en: string; ar: string }) {
  return (
    <tr>
      <td className="border border-slate-800 p-1 text-center text-[10.5px] w-6">{n}</td>
      <td className="border border-slate-800 p-1 text-[10.5px]">{en}</td>
      <td className="border border-slate-800 p-1 text-[10.5px]" dir="rtl">{ar}</td>
    </tr>
  );
}

function OfficialStamp({ certNumber, date }: { certNumber: string; date: string }) {
  return (
    <svg viewBox="0 0 160 160" className="w-32 h-32" style={{ transform: 'rotate(-8deg)' }}>
      <defs>
        <path id="stampTopArc" d="M 18,80 A 62,62 0 0 1 142,80" fill="none" />
        <path id="stampBottomArc" d="M 142,90 A 62,62 0 0 1 18,90" fill="none" />
      </defs>
      <circle cx="80" cy="80" r="70" fill="none" stroke="#b91c1c" strokeWidth="2" opacity="0.85" />
      <circle cx="80" cy="80" r="58" fill="none" stroke="#b91c1c" strokeWidth="1.5" opacity="0.85" />
      <text fontSize="8.5" fontWeight="bold" fill="#b91c1c" opacity="0.85" letterSpacing="1">
        <textPath href="#stampTopArc" startOffset="50%" textAnchor="middle">FEDERAL REPUBLIC OF SOMALIA</textPath>
      </text>
      <text fontSize="8" fontWeight="bold" fill="#b91c1c" opacity="0.85" letterSpacing="1">
        <textPath href="#stampBottomArc" startOffset="50%" textAnchor="middle">MINISTRY OF LIVESTOCK</textPath>
      </text>
      <text x="80" y="72" textAnchor="middle" fontSize="9" fontWeight="extrabold" fill="#b91c1c" opacity="0.9">VETERINARY</text>
      <text x="80" y="84" textAnchor="middle" fontSize="9" fontWeight="extrabold" fill="#b91c1c" opacity="0.9">APPROVED</text>
      <text x="80" y="98" textAnchor="middle" fontSize="7" fill="#b91c1c" opacity="0.85">{certNumber}</text>
      <text x="80" y="108" textAnchor="middle" fontSize="6.5" fill="#b91c1c" opacity="0.85">{date}</text>
    </svg>
  );
}

export default function CertificatePrint({ cert }: { cert: Certificate }) {
  const rows = cert.animalRows || [];
  const testType = cert.testType || '____';
  const quarantineDays = cert.quarantineDays || '____';
  const rvfResult = cert.rvf || '____';
  const brucellaResult = cert.brucella || '____';
  const vaccinationEn = cert.vaccination === 'Vaccinated' ? 'were vaccinated'
    : cert.vaccination === 'Not Vaccinated' ? 'were not vaccinated' : 'were / were not vaccinated';
  const vaccinationAr = cert.vaccination === 'Vaccinated' ? 'تم تحصين جميع الحيوانات'
    : cert.vaccination === 'Not Vaccinated' ? 'لم يتم تحصين الحيوانات' : 'تم تحصين / لم يتم تحصين الحيوانات';
  const placeOfLoading = [cert.port, cert.loadingPlace].filter(Boolean).join(' — ');
  const destination = [cert.destinationPort, cert.country].filter(Boolean).join(', ');

  return (
    <div id="certificate-print-area" className="p-8 text-slate-900">
      <div className="flex items-start justify-between mb-2">
        <img src={somaliaEmblemDataUri} alt="Federal Republic of Somalia" className="w-20 h-16 object-contain" />
        <div className="flex-1 text-center px-3">
          <div className="font-extrabold text-base">Federal Republic of Somalia</div>
          <div className="text-sm">Ministry of Livestock Foresty and Range</div>
          <div className="font-extrabold text-lg mt-1">Veterinary Health Certificate for Export Animals</div>
          <div dir="rtl" className="font-extrabold text-lg">شهادة صحية بيطرية لتصدير الحيوانات الحية</div>
        </div>
        <div className="w-16 h-16 border border-slate-400 flex items-center justify-center shrink-0">
          <QrCode size={44} />
        </div>
      </div>
      <div className="flex justify-between items-baseline text-[11px] mb-3">
        <div>Date of Collection: <span className="font-bold">{cert.issue_date}</span> &nbsp;&nbsp; Collected by: <span className="font-bold">{cert.officer}</span></div>
        <div className="text-sm font-bold">Certificate No: <span className="font-normal">{cert.certificate_number}</span></div>
      </div>

      <table className="w-full border-collapse mb-3">
        <tbody>
          <tr>
            <FieldCell en="Name and Address of Exporter" ar="اسم المصدر وعنوانه" value={cert.exporter} />
            <FieldCell en="Name and Address of Importer" ar="اسم المستورد وعنوانه" value={cert.importer} />
          </tr>
          <tr>
            <FieldCell en="Country of Origin" ar="بلد المنشأ" value="Somalia" />
            <FieldCell en="Destination (Port/Country)" ar="ميناء الوصول" value={destination} />
          </tr>
          <tr>
            <FieldCell en="Place of Loading" ar="منفذ التصدير" value={placeOfLoading} />
            <FieldCell en="Means of Transport" ar="وسيلة النقل" value={cert.transport} />
          </tr>
        </tbody>
      </table>

      <table className="w-full border-collapse mb-3">
        <thead>
          <tr>
            <th className={th}><div className="font-bold text-[11px]">Number</div><div dir="rtl" className="text-[11px]">العدد</div></th>
            <th className={th}><div className="font-bold text-[11px]">Species & Breed</div><div dir="rtl" className="text-[11px]">النوع والسلالة</div></th>
            <th className={th}><div className="font-bold text-[11px]">Sex</div><div dir="rtl" className="text-[11px]">الجنس</div></th>
            <th className={th}><div className="font-bold text-[11px]">Age</div><div dir="rtl" className="text-[11px]">العمر</div></th>
            <th className={th}><div className="font-bold text-[11px]">Identification</div><div dir="rtl" className="text-[11px]">التعريف</div></th>
            <th className={th}><div className="font-bold text-[11px]">Additional Information</div><div dir="rtl" className="text-[11px]">معلومات اخرى</div></th>
          </tr>
        </thead>
        <tbody>
          {rows.length > 0 ? rows.map((r, i) => (
            <tr key={i}>
              <td className="border border-slate-800 p-1.5 text-[11px]">{r.quantity}</td>
              <td className="border border-slate-800 p-1.5 text-[11px]">{r.species}{r.breed ? ` - ${r.breed}` : ''}</td>
              <td className="border border-slate-800 p-1.5 text-[11px]">{r.sex}</td>
              <td className="border border-slate-800 p-1.5 text-[11px]">{r.age}</td>
              <td className="border border-slate-800 p-1.5 text-[11px]">{r.earTag}</td>
              <td className="border border-slate-800 p-1.5 text-[11px]"></td>
            </tr>
          )) : (
            <tr><td colSpan={6} className="border border-slate-800 p-1.5 h-6"></td></tr>
          )}
        </tbody>
      </table>

      <div className="mb-1.5">
        <div className="font-bold text-[11px]">The undersigned Officer certifies that:</div>
        <div dir="rtl" className="text-[11px] font-bold">أشهد أنا الطبيب البيطري الموقع أدناه بأن الحيوانات المذكورة مستوفية للشروط التالية:</div>
      </div>

      <table className="w-full border-collapse mb-5">
        <thead>
          <tr>
            <th className="border border-slate-800 p-1 text-[10.5px] w-6">#</th>
            <th className="border border-slate-800 p-1 text-[10.5px] text-left">Certification Statement (English)</th>
            <th className="border border-slate-800 p-1 text-[10.5px] text-right" dir="rtl">البيان (Arabic)</th>
          </tr>
        </thead>
        <tbody>
          <StatementRow n={1}
            en="All animals were examined before entering the Quarantine."
            ar="تم فحص جميع الحيوانات ظاهريا قبل دخولها المحجر ضد الأمراض المحجرية." />
          <StatementRow n={2}
            en={`The animals have been kept in an accredited Quarantine station for a period of (${quarantineDays}) days.`}
            ar={`تم حجز الحيوانات لمدة (${quarantineDays}) يوم من المحجر البيطري المعتمد.`} />
          <StatementRow n={3}
            en="All animals are identified with serial numbers of ear tags."
            ar="جميع الحيوانات مرقمة بأرقام الأذن." />
          <StatementRow n={4}
            en="All animals were sprayed against external diseases and parasites."
            ar="تم رش جميع الحيوانات ضد الأمراض والطفيليات الخارجية." />
          <StatementRow n={5}
            en="All animals are free from any clinical signs of infectious diseases."
            ar="جميع الحيوانات خالية من أي أعراض سريرية للأمراض المعدية." />
          <StatementRow n={6}
            en="All animals were / were not vaccinated against Rift Valley Fever (RVF). [circle applicable]"
            ar="جميع الحيوانات محصنة / غير محصنة ضد مرض حمى الوادي المتصدع (RVF)." />
          <StatementRow n={7}
            en={`All animals ${vaccinationEn} prior to export.`}
            ar={`${vaccinationAr} قبل التصدير.`} />
          <StatementRow n={8}
            en={`Animals were tested against Rift Valley Fever (RVF) on day ___ of Quarantine using the (${testType}) test and the result was ${rvfResult}.`}
            ar={`تم فحص جميع الحيوانات ضد مرض حمى الوادي المتصدع (RVF) في اليوم ____ للحجر باستخدام اختبار (${testType}) واتضح أنها ${rvfResult}.`} />
          <StatementRow n={9}
            en={`All animals were subjected to serological test for Brucella with (${testType}) test in week ___ of Quarantine and the result was ${brucellaResult}.`}
            ar={`تم فحص جميع الحيوانات ضد مرض الحمى المالطية باستخدام اختبار (${testType}) في الأسبوع ____ من الحجر واتضح أنها ${brucellaResult}.`} />
        </tbody>
      </table>

      <div className="flex justify-between items-end text-[11px]">
        <div>
          <div className="font-bold mb-2">Official Veterinary Officer</div>
          <div className="mb-1.5">Name: <span className="font-bold">{cert.approvedBy || '______________________________'}</span></div>
          <div className="mb-1.5">
            Signature: <span className="italic" style={{ fontFamily: 'cursive', fontSize: '15px' }}>{cert.approvedBy || '______________________________'}</span>
          </div>
          <div>Date: <span className="font-bold">{cert.approvalDate || cert.issue_date}</span></div>
        </div>
        <OfficialStamp certNumber={cert.certificate_number} date={cert.approvalDate || cert.issue_date} />
      </div>
    </div>
  );
}
