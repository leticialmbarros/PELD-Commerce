
export enum FlowType {
  HOME = 'HOME',
  DIARIES = 'DIARIES',
  PURCHASES = 'PURCHASES',
  SUCCESS = 'SUCCESS'
}

export enum Urgency {
  LOW = 'Baixa',
  MEDIUM = 'Média',
  HIGH = 'Alta'
}

export interface Beneficiary {
  id: string;
  name: string;
  quantity: number;
  bank: string;
  agency: string;
  account: string;
  accountType: string;
  cpf: string;
}

export interface PurchaseData {
  requesterName: string;
  contact: string;
  group: string;
  subgroup: string;
  itemName: string;
  technicalDescription: string;
  quantity: number;
  links: string[];
  justification: string;
  urgency: Urgency;
  limitDate: string;
}

export interface DiaryData {
  requesterName: string;
  contact: string;
  group: string;
  subgroup: string;
  startDate: string;
  endDate: string;
  beneficiaries: Beneficiary[];
}
