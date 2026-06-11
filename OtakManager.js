// ========== OTK MANAGER V2 ==========
class OtakManager {
  constructor() {
    this.binaList = ['shohih', 'mudhoaf', 'ajwaf', 'naqish', 'mahmuz', 'mitsal', 'lafif'];
  }

  // 1 PINTU UNTUK SEMUA BINA + BAB
  tasrif(asal, bina, bab = 1) {
    asal = asal.replace(/\s/g, ' ').trim();
    bina = bina.toLowerCase();

    let otak;
    switch(bina) {
      case 'shohih':
        otak = new OtakShohihAllBab(asal, bab);
        break;
      case 'mudhoaf':
        otak = new OtakMudhoafAllBab(asal, bab);
        break;
      case 'ajwaf':
        otak = new OtakAjwafAllBab(asal, bab);
        break;
      case 'naqish':
        otak = new OtakNaqishAllBab(asal, bab);
        break;
      case 'mahmuz':
        otak = new OtakMahmuzAllBab(asal, bab);
        break;
      case 'mitsal':
        otak = new OtakMitsalAllBab(asal, bab);
        break;
      case 'lafif':
        otak = new OtakLafifAllBab(asal, bab);
        break;
      default:
        throw new Error(`Bina ${bina} tidak dikenal. Pilih: ${this.binaList.join(', ')}`);
    }

    // PANGGIL TASRIF KOMPLIT DARI OTKNYA
    return otak.tasrif();
  }

  listBina() {
    return this.binaList;
  }

  // FITUR TAMBAHAN: DETEKSI BINA OTOMATIS
  deteksiBina(asal) {
    [this.f, this.ain, this.lam] = asal.split(' ');

    if(this.f === this.ain || this.ain === this.lam) return 'mudhoaf';
    if(['و','ي','ا'].includes(this.ain)) return 'ajwaf';
    if(['و','ي','ا'].includes(this.lam)) return 'naqish';
    if(['و','ي','ا'].includes(this.f)) return 'mitsal';
    if(this.f === 'ء' || this.ain === 'ء' || this.lam === 'ء') return 'mahmuz';
    if(['و','ي','ا'].includes(this.f) && ['و','ي','ا'].includes(this.lam)) return 'lafif';
    return 'shohih';
  }
}

// ========== CONTOH PAKE ==========
const otak = new OtakManager();

// 1. SHOHIH BAB 1
const shohih = otak.tasrif('ن ص ر', 'shohih', 1);
console.log('=== SHOHIH BAB 1 ===');
console.log(shohih.wazan); // فَعَلَ يَفْعُلُ
console.log(shohih.istilah[1]); // المضارع: يَنْصُرُ
console.log(shohih.lughowi.madhi[0]); // هو: نَصَرَ <-- INI LUGHOWI NYA
console.log(shohih.lughowi.mudhari[7]); // هم: يَنْصُرُوْنَ
console.log(shohih.lughowi.isimFail[0]); // مفرد مذكر: نَاصِرٌ
console.log(shohih.jamak.dariFiil.taksir[0]); // فُعُول: نُصُوْر

// 2. MUDHO'AF BAB 1
const mudhoaf = otak.tasrif('م د', 'mudhoaf', 1);
console.log('\n=== MUDHOAF BAB 1 ===');
console.log(mudhoaf.istilah[1]); // المضارع: يَمُدُّ
console.log(mudhoaf.lughowi.madhi[0]); // هو: مَدَّ <-- ADA LUGHOWI
console.log(mudhoaf.lughowi.isimAlat[0]); // هو: مِدّ

// 3. DETEKSI OTOMATIS
console.log('\n=== DETEKSI BINA ===');
console.log(otak.deteksiBina('ق و ل')); // ajwaf
console.log(otak.deteksiBina('د ع و')); // naqish
console.log(otak.deteksiBina('و ع د')); // mitsal

// 4. STRUKTUR OUTPUT KOMPLIT
/*
{
  asal: 'ن ص ر',
  bina: 'Shohih',
  bab: 1,
  wazan: 'فَعَلَ يَفْعُلُ',

  istilah: [...12 bentuk...],

  lughowi: { <-- INI DIA
    madhi: [...14 dhamir...],
    mudhari: [...14 dhamir...],
    amar: [...14 dhamir...],
    nahi: [...14 dhamir...],
    isimFail: [...6 bentuk...],
    isimMaful: [...6 bentuk...],
    isimZaman: [...6 bentuk...],
    isimMakan: [...6 bentuk...],
    isimAlat: [...14 bentuk...]
  },

  masdar: { masdar23: [...], marrah: [...], nau: [...] },
  sifatMusyabihat: [...],
  jamak: { dariFiil: {...}, dariIsimFail: {...},...6 sumber... },
  isimTafdhil: {...}
*/