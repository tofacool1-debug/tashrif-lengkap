export interface ShighotDetail {
  mufrod: string;
  jamak: string[];
  muntahal: string[];
}

export interface DataWazan {
  fa: string;
  ain: string;
  lam: string;
  babNum: number;
}

export interface TasrifIstilahiData {
  madhi: string;
  mudhari: string;
  amar: string;
  nahi: string;
  masdar: string;
  isimFail: ShighotDetail;
  isimMaful: ShighotDetail;
  isimMusyabihat: ShighotDetail;
  musyabihat6: string[];
  isimZaman: ShighotDetail;
  isimMakan: ShighotDetail;
  isimAlat: ShighotDetail;
  marrah: string;
  nau: string;
  isimTashghir: string;
}

export interface TasrifLughowi {
  madhi14: string[];
  mudhari14: string[];
  amar12: string[];
  nahi12: string[];
  isimFail6: string[];
  isimMaful6: string[];
  isimZaman6: string[];
  isimMakan6: string[];
  isimAlat6: string[];
  isimMusyabihat6: string[];
}

export interface PluralIsimFail { 
  qillah: string; 
  katsroh: string; 
  muntahal: string; 
  explanation: string; 
}

export interface PluralIsimMaful { 
  qillah: string; 
  katsroh: string; 
  muntahal: string; 
  explanation: string; 
}

export interface PluralIsimZamanMakan { 
  mufrod: string; 
  qillah: string; 
  katsroh: string; 
  muntahal: string; 
  explanation: string; 
}

export interface PluralIsimAlat { 
  mufrod: string; 
  qillah: string; 
  katsroh: string; 
  muntahal: string; 
  explanation: string; 
}

export interface PluralSifatMusyabihat {  
  mufrodMudzakkar?: string;
  mufrodMuannas: string; 
  jamakTaksir?: string; 
  katsroh?: string;
  qillah?: string;
  muntahal: string;  
  wazanName?: string;
  isQiyasi: boolean; 
  isSamai: boolean; 
  reference: string; 
  explanation: string; 
}

export interface JamakData {
  isimFail: { qillah?: string; katsroh?: string; muntahal?: string };
  isimMaful: { qillah?: string; katsroh?: string; muntahal?: string };
  zaman: { qillah?: string; katsroh?: string; muntahal?: string };
  makan: { qillah?: string; katsroh?: string; muntahal?: string };
  alat: { qillah?: string; katsroh?: string; muntahal?: string };
  sifatMusyabihat: PluralSifatMusyabihat;
}

export interface DictionaryEntry {
  id?: string;
  root: { fa: string; ain: string; lam: string };
  translation?: string;
  bina: string;
  sifatMusyabihat: string;
  babNum: number;
  masdarSamai?: string;
  masdarQiyasi?: string;
  sifatMusyabihatPlural?: {
    mufrod_mudzakkar?: string;
    mufrod_muannas?: string;
    katsroh?: string;
    muntahal?: string;
  };
  isLazim?: boolean;

  tasrifIstilahi?: TasrifIstilahiData;
  tasrifLughowi?: TasrifLughowi;
  pluralIsimFail?: PluralIsimFail;
  pluralIsimMaful?: PluralIsimMaful;
  pluralIsimZamanMakan?: PluralIsimZamanMakan;
  pluralIsimAlat?: PluralIsimAlat;
  pluralSifatMusyabihat?: PluralSifatMusyabihat;

  // Added fields to match app.tsx usage
  lughowi?: TasrifLughowi;
  istilahi?: TasrifIstilahiData;
  jamak?: JamakData;
}