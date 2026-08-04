import { Certificate, Payment, IncomeExpense, ExporterEntity, ImporterEntity, UserEntity, AccountName } from '../types';

export const initialCertificates: Certificate[] = [
  { id:1, certificate_number:'LCS-2026-0142', exporter:'Horn Exports Co.', importer:'Al Rajhi Trading (Saudi Arabia)', country:'Saudi Arabia', port:'Berbera Port', transport:'Sea Vessel', loadingPlace:'Berbera Quarantine Yard',
    animals:'Sheep ×450', animalRows:[{ species:'Sheep', breed:'Somali Blackhead', sex:'Mixed', age:'1-2 years', earTag:'SH-1042', quantity:'450', rate:'2' }],
    status:'approved', issue_date:'2026-07-30', officer:'Dr. Ahmed Nur', feeAmount: 900,
    quarantineDays:'14', quarantinePlace:'Berbera Quarantine Station', rvf:'Negative', fmd:'Negative', brucella:'Negative', testType:'ELISA', vaccination:'Vaccinated', clinicalExam:'Passed', remarks:'Herd inspected and cleared for export.',
    approvedBy:'Dr. Sara Hassan', approvalDate:'2026-07-30' },
  { id:2, certificate_number:'LCS-2026-0141', exporter:'Al-Amin Livestock Trading', importer:'Gulf Livestock Imports (UAE)', country:'UAE', port:'Bosaso Port', transport:'Sea Vessel', loadingPlace:'Bosaso Holding Yard',
    animals:'Cattle ×120', animalRows:[{ species:'Cattle', breed:'Boran', sex:'Male', age:'2-3 years', earTag:'CT-2207', quantity:'120', rate:'3' }],
    status:'printed', issue_date:'2026-07-28', officer:'Dr. Ahmed Nur', feeAmount: 360,
    quarantineDays:'10', quarantinePlace:'Bosaso Quarantine Station', rvf:'Negative', fmd:'Negative', brucella:'Negative', testType:'PCR', vaccination:'Vaccinated', clinicalExam:'Passed', remarks:'No abnormalities observed.',
    approvedBy:'Dr. Sara Hassan', approvalDate:'2026-07-28' },
  { id:3, certificate_number:'LCS-2026-0140', exporter:'Berbera Livestock Ltd', importer:'Jeddah Animal Market', country:'Saudi Arabia', port:'Berbera Port', transport:'Truck', loadingPlace:'Berbera Livestock Yard',
    animals:'Goat ×300', animalRows:[{ species:'Goat', breed:'Boer', sex:'Female', age:'1 year', earTag:'GT-3391', quantity:'300', rate:'2' }],
    status:'draft', issue_date:'2026-07-31', officer:'Dr. Ahmed Nur', feeAmount: 600 },
  { id:4, certificate_number:'LCS-2026-0139', exporter:'Golden Gate Traders', importer:'Al Rajhi Trading (Saudi Arabia)', country:'Saudi Arabia', port:'Berbera Port', transport:'Sea Vessel', loadingPlace:'Berbera Quarantine Yard',
    animals:'Camel ×40', animalRows:[{ species:'Camel', breed:'Somali', sex:'Male', age:'4-5 years', earTag:'CM-0087', quantity:'40', rate:'5' }],
    status:'printed', issue_date:'2026-07-20', officer:'Dr. Ahmed Nur', feeAmount: 200,
    quarantineDays:'21', quarantinePlace:'Berbera Quarantine Station', rvf:'Negative', fmd:'Negative', brucella:'Negative', testType:'Serological', vaccination:'Vaccinated', clinicalExam:'Passed', remarks:'Cleared after extended quarantine.',
    approvedBy:'Dr. Sara Hassan', approvalDate:'2026-07-20' },
  { id:5, certificate_number:'LCS-2026-0138', exporter:'Horn Exports Co.', importer:'Gulf Livestock Imports (UAE)', country:'UAE', port:'Bosaso Port', transport:'Sea Vessel', loadingPlace:'Bosaso Holding Yard',
    animals:'Sheep ×620', animalRows:[{ species:'Sheep', breed:'Somali Blackhead', sex:'Mixed', age:'1-2 years', earTag:'SH-1198', quantity:'620', rate:'2' }],
    status:'approved', issue_date:'2026-07-25', officer:'Dr. Ahmed Nur', feeAmount: 1240,
    quarantineDays:'14', quarantinePlace:'Bosaso Quarantine Station', rvf:'Negative', fmd:'Negative', brucella:'Negative', testType:'ELISA', vaccination:'Vaccinated', clinicalExam:'Passed',
    approvedBy:'Dr. Sara Hassan', approvalDate:'2026-07-25' },
  { id:6, certificate_number:'LCS-2026-0137', exporter:'Al-Amin Livestock Trading', importer:'Jeddah Animal Market', country:'Saudi Arabia', port:'Berbera Port', transport:'Truck', loadingPlace:'Berbera Livestock Yard',
    animals:'Cattle ×85', animalRows:[{ species:'Cattle', breed:'Boran', sex:'Mixed', age:'2 years', earTag:'CT-2255', quantity:'85', rate:'3' }],
    status:'cancelled', issue_date:'2026-07-15', officer:'Dr. Ahmed Nur', feeAmount: 255,
    quarantineDays:'10', quarantinePlace:'Berbera Quarantine Station', rvf:'Positive', fmd:'Negative', brucella:'Negative', testType:'PCR', vaccination:'Not Vaccinated', clinicalExam:'Failed', remarks:'Shipment cancelled — RVF positive result on retest.' },
  { id:7, certificate_number:'LCS-2026-0136', exporter:'Berbera Livestock Ltd', importer:'Al Rajhi Trading (Saudi Arabia)', country:'Saudi Arabia', port:'Berbera Port', transport:'Sea Vessel', loadingPlace:'Berbera Quarantine Yard',
    animals:'Goat ×410', animalRows:[{ species:'Goat', breed:'Boer', sex:'Mixed', age:'1-2 years', earTag:'GT-3410', quantity:'410', rate:'2' }],
    status:'printed', issue_date:'2026-07-12', officer:'Dr. Ahmed Nur', feeAmount: 820,
    quarantineDays:'7', quarantinePlace:'Berbera Quarantine Station', rvf:'Negative', fmd:'Negative', brucella:'Negative', testType:'Rose Bengal', vaccination:'Vaccinated', clinicalExam:'Passed',
    approvedBy:'Dr. Sara Hassan', approvalDate:'2026-07-12' },
  { id:8, certificate_number:'LCS-2026-0135', exporter:'Horn Exports Co.', importer:'Gulf Livestock Imports (UAE)', country:'UAE', port:'Bosaso Port', transport:'Sea Vessel', loadingPlace:'Bosaso Holding Yard',
    animals:'Sheep ×390', animalRows:[{ species:'Sheep', breed:'Somali Blackhead', sex:'Female', age:'1 year', earTag:'SH-1390', quantity:'390', rate:'2' }],
    status:'printed', issue_date:'2026-07-10', officer:'Dr. Ahmed Nur', feeAmount: 780,
    quarantineDays:'14', quarantinePlace:'Bosaso Quarantine Station', rvf:'Negative', fmd:'Negative', brucella:'Negative', testType:'ELISA', vaccination:'Vaccinated', clinicalExam:'Passed',
    approvedBy:'Dr. Sara Hassan', approvalDate:'2026-07-10' },
  { id:9, certificate_number:'LCS-2026-0134', exporter:'Golden Gate Traders', importer:'Jeddah Animal Market', country:'Saudi Arabia', port:'Berbera Port', transport:'Truck', loadingPlace:'Berbera Livestock Yard',
    animals:'Cattle ×60', animalRows:[{ species:'Cattle', breed:'Boran', sex:'Male', age:'2 years', earTag:'CT-2260', quantity:'60', rate:'3' }],
    status:'draft', issue_date:'2026-07-05', officer:'Dr. Ahmed Nur', feeAmount: 180 },
];

export const initialPayments: Payment[] = [
  { id:1, certificate_number:'LCS-2026-0142', customer:'Horn Exports Co.', amount:900, method:'Bank', status:'completed', date:'2026-07-30' },
  { id:2, certificate_number:'LCS-2026-0140', customer:'Berbera Livestock Ltd', amount:600, method:'ZAAD', status:'pending', date:'2026-07-31' },
  { id:3, certificate_number:'LCS-2026-0138', customer:'Horn Exports Co.', amount:1240, method:'Cash', status:'completed', date:'2026-07-25' },
];

export const initialIncomes: IncomeExpense[] = [
  { id:1, category:'Certificate Fee', amount:900, description:'LCS-2026-0142 payment', date:'2026-07-30', account:'Bank', autoGenerated:true },
  { id:2, category:'Certificate Fee', amount:1240, description:'LCS-2026-0138 payment', date:'2026-07-25', account:'Cash', autoGenerated:true },
  { id:3, category:'Inspection Fee', amount:300, description:'Additional inspection charge', date:'2026-07-20' },
];

export const initialExpenses: IncomeExpense[] = [
  { id:1, category:'Office Rent', amount:800, description:'July office rent', date:'2026-07-01', account:'Bank' },
  { id:2, category:'Fuel', amount:150, description:'Field vehicle fuel', date:'2026-07-15', account:'Cash' },
];

export const initialAccounts: Record<AccountName, number> = {
  Cash: 4200, Bank: 18600, ZAAD: 2100, 'EVC Plus': 1500, 'Premier Wallet': 900,
};

export const initialExporters: ExporterEntity[] = [
  { id:1, name:'Horn Exports Co.', contact:'Ahmed Yusuf', phone:'+252 61 234 5678', license:'EXP-2201' },
  { id:2, name:'Al-Amin Livestock Trading', contact:'Fatima Warsame', phone:'+252 61 987 6543', license:'EXP-2202' },
  { id:3, name:'Berbera Livestock Ltd', contact:'Omar Ali', phone:'+252 61 555 1122', license:'EXP-2203' },
  { id:4, name:'Golden Gate Traders', contact:'Layla Hassan', phone:'+252 61 444 3399', license:'EXP-2204' },
];

export const initialImporters: ImporterEntity[] = [
  { id:1, name:'Al Rajhi Trading (Saudi Arabia)', country:'Saudi Arabia', contact:'Khalid Al Rajhi', phone:'+966 50 123 4567' },
  { id:2, name:'Gulf Livestock Imports (UAE)', country:'UAE', contact:'Rashid Al Maktoum', phone:'+971 50 987 6543' },
  { id:3, name:'Jeddah Animal Market', country:'Saudi Arabia', contact:'Sami Zahrani', phone:'+966 55 222 3344' },
];

export const initialUsers: UserEntity[] = [
  { id:1, name:'Dr. Ahmed Nur', email:'ahmed.nur@livestockgate.gov', role:'Admin', status:'active' },
  { id:2, name:'Dr. Sara Hassan', email:'sara.hassan@livestockgate.gov', role:'Veterinary Officer', status:'active' },
  { id:3, name:'Mo Farah', email:'mo.farah@livestockgate.gov', role:'Data Entry Clerk', status:'active' },
  { id:4, name:'Amina Jama', email:'amina.jama@livestockgate.gov', role:'Finance Officer', status:'active' },
  { id:5, name:'Yusuf Abdi', email:'yusuf.abdi@livestockgate.gov', role:'Data Field Collector', status:'active' },
];

export const speciesRateDefaults: Record<string, number> = { Cattle: 3, Sheep: 2, Goat: 2, Camel: 5 };
