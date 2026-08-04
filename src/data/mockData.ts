import { Certificate, Payment, IncomeExpense, ExporterEntity, ImporterEntity, UserEntity, AccountName } from '../types';

export const initialCertificates: Certificate[] = [];

export const initialPayments: Payment[] = [];

export const initialIncomes: IncomeExpense[] = [];

export const initialExpenses: IncomeExpense[] = [];

export const initialAccounts: Record<AccountName, number> = {
  'Darasalam Bank Account': 0, 'Dahabshiil Bank Account': 0,
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
