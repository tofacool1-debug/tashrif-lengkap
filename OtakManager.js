import Kamus from './data.js';
import OtakShohihAllBab from './otak_shohih_all_bab.js';
import OtakMudhoafAllBab from './otak_mudhoaf_all_bab.js';
import OtakAjwafAllBab from './otak_ajwaf_all_bab.js';
import OtakNaqishAllBab from './otak_naqish_all_bab.js';
import OtakMitsalAllBab from './otak_mitsal_all_bab.js';
import OtakMahmuzAllBab from './otak_mahmuz_all_bab.js';
import OtakLafifAllBab from './otak_lafif_all_bab.js';

export default class OtakManager {
  
  // DETEKTIF 100% ANTI TABRAKAN
  static detectBina(asal) {
    const [f, ain, lam] = asal.split(' ');
    const isFIllat = f === 'و' || f === 'ي';
    const isAinIllat = ain === 'و' || ain === 'ي';
    const isLamIllat = lam === 'و' || lam === 'ي';
    const isMahmuz = f === 'أ' || ain === 'أ' || lam === 'أ' || f === 'ء' || ain === 'ء' || lam === 'ء';

    // 1. LAFIF: 2 huruf illat. Cek paling atas biar gak ketiban Ajwaf/Naqish/Mitsal
    if(isFIllat && isLamIllat) return 'Lafif'; // Mafruq: و ق ى
    if(isAinIllat && isLamIllat) return 'Lafif'; // Maqrun: ط و ى

    // 2. MUDHOAF: ain = lam. Cek sebelum Ajwaf biar "مدّ" gak ke detect Ajwaf
    if(ain === lam) return 'Mudhoaf';

    // 3. AJWAF: ain illat doang
    if(isAinIllat) return 'Ajwaf';

    // 4. NAQISH: lam illat doang
    if(isLamIllat) return 'Naqish';

    // 5. MITSAL: fاء illat doang
    if(isFIllat) return 'Mitsal';

    // 6. MAHMUZ: ada همزة
    if(isMahmuz) return 'Mahmuz';

    // 7. DEFAULT: Shohih
    return 'Shohih';
  }

  // Bos kasih tau posisi همزة buat Mahmuz
  static detectMahmuzPosisi(asal) {
    const [f, ain, lam] = asal.split(' ');
    if(f === 'أ' || f === 'ء') return 'Fa';
    if(ain === 'أ' || ain === 'ء') return 'Ain';
    return 'Lam'; // default Lam
  }

  // BOS BAGI TUGAS + KASIH SUB-TIPE
  static createOtak(asal, bab = 1) {
    const bina = this.detectBina(asal);
    const [f, ain, lam] = asal.split(' ');

    switch(bina) {
      case 'Shohih':
        return new OtakShohihAllBab(asal, bab);

      case 'Mudhoaf':
        return new OtakMudhoafAllBab(asal, bab);

      case 'Ajwaf':
        return new OtakAjwafAllBab(asal, bab);

      case 'Naqish':
        return new OtakNaqishAllBab(asal, bab);

      case 'Mitsal':
        return new OtakMitsalAllBab(asal, bab);

      case 'Mahmuz':
        const posisi = this.detectMahmuzPosisi(asal);
        return new OtakMahmuzAllBab(asal, bab, posisi);

      case 'Lafif':
        // Kasih tau koki Lafif: ini Mafruq apa Maqrun
        const jenisLafif = (f === 'و' || f === 'ي') ? 'Mafruq' : 'Maqrun';
        return new OtakLafifAllBab(asal, bab, jenisLafif);

      default:
        return new OtakShohihAllBab(asal, bab);
    }
  }

  // PINTU MASUK SATU-SATUNYA
  static tasrif(asal, bab = 1) {
    const otak = this.createOtak(asal, bab);
    const hasil = otak.tasrif();
    hasil.bina = this.detectBina(asal); // Tempalin label bina biar enak di debug
    return hasil;
  }
}
