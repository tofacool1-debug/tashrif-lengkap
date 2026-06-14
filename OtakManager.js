import Kamus from './data.js';
import OtakShohihAllBab from './otak_shohih_all_bab.js';
import OtakMudhoafAllBab from './otak_mudhoaf_all_bab.js';
import OtakAjwafAllBab from './otak_ajwaf_all_bab.js';
import OtakNaqishAllBab from './otak_naqish_all_bab.js';
import OtakMitsalAllBab from './otak_mitsal_all_bab.js';
import OtakMahmuzAllBab from './otak_mahmuz_all_bab.js';
import OtakLafifAllBab from './otak_lafif_all_bab.js';

class OtakManager {
  static detectBina(asal) {
    const [f, ain, lam] = asal.split(' ');
    
    // Lafif: fاء واو/ياء + lam واو/ياء
    if((f === 'و' || f === 'ي') && (lam === 'و' || lam === 'ي')) return 'Lafif';
    if(ain === 'و' || ain === 'ي') return 'Lafif';
    
    // Mudhoaf: ain = lam
    if(ain === lam) return 'Mudhoaf';
    
    // Ajwaf: ain واو/ياء
    if(ain === 'و' || ain === 'ي') return 'Ajwaf';
    
    // Naqish: lam واو/ياء
    if(lam === 'و' || lam === 'ي') return 'Naqish';
    
    // Mitsal: fاء واو/ياء
    if(f === 'و' || f === 'ي') return 'Mitsal';
    
    // Mahmuz: ada همزة
    if(f === 'أ' || ain === 'أ' || lam === 'أ' || f === 'ء' || ain === 'ء' || lam === 'ء') return 'Mahmuz';
    
    // Default Shohih
    return 'Shohih';
  }

  static detectMahmuzPosisi(asal) {
    const [f, ain, lam] = asal.split(' ');
    if(f === 'أ' || f === 'ء') return 'Fa';
    if(ain === 'أ' || ain === 'ء') return 'Ain';
    if(lam === 'أ' || lam === 'ء') return 'Lam';
    return 'Fa';
  }

  static createOtak(asal, bab = 1) {
    const bina = this.detectBina(asal);
    
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
        return new OtakLafifAllBab(asal, bab);
      default:
        return new OtakShohihAllBab(asal, bab);
    }
  }

  static tasrif(asal, bab = 1) {
    const otak = this.createOtak(asal, bab);
    return otak.tasrif();
  }
}

export default OtakManager;
