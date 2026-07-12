import {
  TasrifIstilahiData, ShighotDetail, DataWazan, TasrifLughowi,
  DictionaryEntry, PluralIsimFail, PluralIsimMaful, PluralIsimZamanMakan, PluralIsimAlat, PluralSifatMusyabihat
} from "../type/type";

const FATHA = "\u064e";
const DAMMA = "\u064f";
const KASRA = "\u0650";
const SUKUN = "\u0652";
const SHADDA = "\u0651";
const TANWIN_DAMMA = "\u064c";

// WAZAN BAB MUJARROD 1-6
const WAZAN_DB: Record<number, { madhi: string; mudhari: string; masdar: string }> = {
 1: { madhi: "فَعَلَ", mudhari: "يَفْعُلُ", masdar: "فَعْلٌ" },
 2: { madhi: "فَعَلَ", mudhari: "يَفْعِلُ", masdar: "فَعْلٌ" },
 3: { madhi: "فَعَلَ", mudhari: "يَفْعَلُ", masdar: "فَعْلٌ" },
 4: { madhi: "فَعِلَ", mudhari: "يَفْعَلُ", masdar: "فِعْلٌ" },
 5: { madhi: "فَعُلَ", mudhari: "يَفْعُلُ", masdar: "فُعْلٌ" },
 6: { madhi: "فَعِلَ", mudhari: "يَفْعِلُ", masdar: "فِعْلٌ" },
};

export const IilalEngine = {
  replaceRoot(pattern: string, fa: string, ain: string, lam: string): string {
    return pattern.replace(/ف/g, "__FA__").replace(/ع/g, "__AIN__").replace(/ل/g, "__LAM__").replace(/__FA__/g, fa).replace(/__AIN__/g, ain).replace(/__LAM__/g, lam);
  },

  cd(s: string): string { return s.replace(/[\u064b-\u065f]/g, ""); },

  detectBina(fa: string, ain: string, lam: string): string {
    const isFaWeak = ["و", "ي"].includes(fa); const isAinWeak = ["و", "ي"].includes(ain); const isLamWeak = ["و", "ي"].includes(lam);
    const isFaHamzah = ["أ", "ء", "إ", "آ"].includes(fa); const isAinHamzah = ["أ", "ء", "ئ", "ؤ"].includes(ain); const isLamHamzah = ["أ", "ء", "ئ", "ؤ"].includes(lam);
    const isMudhoaf = (ain === lam && !isAinWeak && !isAinHamzah);
    if (isFaWeak && isLamWeak) return "Lafif Mafruq"; if (isAinWeak && isLamWeak) return "Lafif Maqrun";
    if (isMudhoaf) return "Mudho'af";
    if (isFaWeak) return "Mitsal";
    if (isAinWeak) return "Ajwaf"; if (isLamWeak) return "Naqis";
    if (isFaHamzah) return "Mahmuz Fa"; if (isAinHamzah) return "Mahmuz 'Ain"; if (isLamHamzah) return "Mahmuz Lam"; return "Shohih";
  },

  getPluralBinaKey(bina: string): string {
    const norm = (bina || "").toLowerCase().trim();
    if (norm.includes("shohih") || norm === "sahih") return "sahih"; if (norm.includes("ajwaf")) return "ajwaf"; if (norm.includes("mitsal")) return "mitsal";
    if (norm === "naqis" || norm.includes("naqish")) return "naqish"; if (norm.includes("muda") || norm.includes("mudho")) return "mudaaf";
    if (norm.includes("mahmuz")) return "mahmuz"; if (norm === "lafif maqrun") return "lafif_maqrun"; if (norm === "lafif mafruq") return "lafif_mafruq";
    if (norm.includes("lafif")) return "lafif_maqrun"; return "sahih";
  },

  applyMahmuzRules(word: string, posisi: "fa" | "ain" | "lam" = "ain"): string {
    let res = word;
    res = res.replace(new RegExp(`${FATHA}ء${SUKUN}`, "g"), `${FATHA}ا`);
    res = res.replace(new RegExp(`${DAMMA}ء${SUKUN}`, "g"), `${DAMMA}و`);
    res = res.replace(new RegExp(`${KASRA}ء${SUKUN}`, "g"), `${KASRA}ي`);
    res = res.replace(/أَأ/g, "آ").replace(/أُأ/g, "أُو").replace(/إِأ/g, "إِ");
    res = res.replace(/ءَأ/g, "آ").replace(/ءُأ/g, "ؤُ").replace(/ءِأ/g, "ئِ");
    if (posisi === "ain") {
      res = res.replace(/َااء/g, "َائ").replace(/ُووء/g, "ُوء").replace(/ِيئ/g, "ِئ");
      res = res.replace(/ااء/g, "ائ").replace(/ووء/g, "ؤو").replace(/يئ/g, "ئي");
    }
    if (posisi === "lam") {
      res = res.replace(/َاء$/g, "َاء").replace(/ِئ$/g, "ِئ").replace(/ُؤ$/g, "ُؤ");
      res = res.replace(/ااء$/g, "اء").replace(/يء$/g, "ئ").replace(/ووء$/g, "ؤ");
    }

    // Perbaikan tulisan hamzah sesuai dengan masukan user:
    // 1. أَابِقُ -> آبِقُ
    res = res.replace(new RegExp(`أ${FATHA}ا`, "g"), "آ");
    res = res.replace(new RegExp(`أ${FATHA}أ${SUKUN}`, "g"), "آ");
    res = res.replace(new RegExp(`أ${FATHA}أ`, "g"), "آ");
    res = res.replace(new RegExp(`أ${FATHA}ء${SUKUN}`, "g"), "آ");
    res = res.replace(/أَأ/g, "آ");

    // 2. اُأْبُقُ -> اُوْبُقُ
    res = res.replace(new RegExp(`ا${DAMMA}أ${SUKUN}?`, "g"), `ا${DAMMA}و${SUKUN}`);
    res = res.replace(new RegExp(`أ${DAMMA}أ${SUKUN}?`, "g"), `أ${DAMMA}و${SUKUN}`);
    res = res.replace(new RegExp(`أ${DAMMA}ؤ${SUKUN}?`, "g"), `أ${DAMMA}و${SUKUN}`);

    // 3. اِأْتِ -> اِيْتِ
    res = res.replace(new RegExp(`ا${KASRA}أ${SUKUN}?`, "g"), `ا${KASRA}ي${SUKUN}`);
    res = res.replace(new RegExp(`إ${KASRA}أ${SUKUN}?`, "g"), `إ${KASRA}ي${SUKUN}`);
    res = res.replace(new RegExp(`إ${KASRA}ئ${SUKUN}?`, "g"), `إ${KASRA}ي${SUKUN}`);

    return res;
  },

  applyIilalMadhi(fa: string, ain: string, lam: string, bina: string, wazanMadhi: string, babNum: number): string {
    let ainVowel = FATHA;
    if (wazanMadhi.includes(`ع${KASRA}`) || wazanMadhi.includes("فَعِلَ")) ainVowel = KASRA;
    else if (wazanMadhi.includes(`ع${DAMMA}`) || wazanMadhi.includes("فَعُلَ")) ainVowel = DAMMA;
    const ashl = `${fa}${FATHA}${ain}${ainVowel}${lam}${FATHA}`;
    if (bina === "Ajwaf") return `${fa}${FATHA}ا${lam}${FATHA}`;
    if (bina === "Naqis" || bina === "Lafif Maqrun" || bina === "Lafif Mafruq") {
      if (lam === "و" && ainVowel === FATHA) return `${fa}${FATHA}${ain}${FATHA}ا`;
      if (lam === "ي" && ainVowel === FATHA) return `${fa}${FATHA}${ain}${FATHA}ى`;
      return `${fa}${FATHA}${ain}${ainVowel}${lam}${FATHA}`;
    }
    if (bina === "Mudho'af") return `${fa}${FATHA}${ain}${SHADDA}${FATHA}`;
    return ashl;
  },

  applyIilalMudhari(fa: string, ain: string, lam: string, bina: string, wazanMudhari: string): string {
    let ashl = this.replaceRoot(wazanMudhari, fa, ain, lam);
    if (bina === "Ajwaf") {
      if (ain === "و") {
        if (wazanMudhari.includes(`ع${DAMMA}`)) ashl = ashl.replace(`ْو${DAMMA}`, `ُو`);
        else if (wazanMudhari.includes(`ع${FATHA}`)) ashl = ashl.replace(`ْو${FATHA}`, `َا`);
      } else if (ain === "ي") {
        if (wazanMudhari.includes(`ع${KASRA}`)) ashl = ashl.replace(`ْي${KASRA}`, `ِي`);
        else if (wazanMudhari.includes(`ع${FATHA}`)) ashl = ashl.replace(`ْي${FATHA}`, `َا`);
      }
    } else if (bina === "Naqis" || bina === "Lafif Maqrun") {
      if (wazanMudhari.includes(`ع${FATHA}`)) {
        ashl = ashl.replace(new RegExp(`[وي]${DAMMA}$`), "َى").replace(new RegExp(`[وي]${FATHA}$`), "َى");
      } else {
        if (lam === "و") ashl = ashl.replace(`و${DAMMA}`, `ُو`);
        else if (lam === "ي") ashl = ashl.replace(`ي${DAMMA}`, `ِي`);
        ashl = ashl.replace("وُ", "ُو").replace("يُ", "ِي");
      }
    } else if (bina === "Mitsal" || bina === "Lafif Mafruq") {
      if (fa === "و" && wazanMudhari.includes(`ع${KASRA}`)) ashl = ashl.replace(`يَوْ`, `يَ`).replace(`تَوْ`, `تَ`);
      if (bina!== "Mitsal") {
        if (wazanMudhari.includes(`ع${FATHA}`)) {
          ashl = ashl.replace(new RegExp(`[وي]${DAMMA}$`), "َى").replace(new RegExp(`[وي]${FATHA}$`), "َى");
        } else {
          if (lam === "و") ashl = ashl.replace(`و${DAMMA}`, `ُو`);
          else if (lam === "ي") ashl = ashl.replace(`ي${DAMMA}`, `ِي`);
          ashl = ashl.replace("وُ", "ُو").replace("يُ", "ِي");
        }
      }
    } else if (bina === "Mudho'af") {
      if (wazanMudhari.includes(`ع${DAMMA}`)) ashl = `يَ${fa}${DAMMA}${ain}${SHADDA}${DAMMA}`;
      else if (wazanMudhari.includes(`ع${KASRA}`)) ashl = `يَ${fa}${KASRA}${ain}${SHADDA}${DAMMA}`;
      else ashl = `يَ${fa}${FATHA}${ain}${SHADDA}${DAMMA}`;
    }
    return ashl;
  },

  applyIilalAmar(fa: string, ain: string, lam: string, bina: string, wazanMudhari: string): string {
    const mudhari = this.applyIilalMudhari(fa, ain, lam, bina, wazanMudhari);
    let base = mudhari.replace(/^يَ/g, "").replace(/^يُ/g, "");
    if (base.charAt(1) === SUKUN || base.includes(`${fa}${SUKUN}`)) {
      const vowelChar = wazanMudhari.includes(`ع${DAMMA}`)? `ا${DAMMA}` : `ا${KASRA}`;
      base = vowelChar + base;
    }
    if (bina === "Naqis" || bina === "Lafif Maqrun" || bina === "Lafif Mafruq") base = base.substring(0, base.length - 2);
    else if (bina === "Mudho'af") base = base.replace(new RegExp(`${DAMMA}$`), FATHA);
    else if (bina === "Ajwaf") {
      let faVowel = KASRA;
      if (wazanMudhari.includes(`ع${DAMMA}`) || wazanMudhari.includes("يَفْعُلُ")) faVowel = DAMMA;
      else if (wazanMudhari.includes(`ع${KASRA}`) || wazanMudhari.includes("يَفْعِلُ")) faVowel = KASRA;
      else if (wazanMudhari.includes(`ع${FATHA}`) || wazanMudhari.includes("يَفْعَلُ")) faVowel = FATHA;
      return `${fa}${faVowel}${lam}${SUKUN}`;
    } else base = base.replace(new RegExp(`${DAMMA}$`), SUKUN);
    return base;
  },

  applyIilalNahi(fa: string, ain: string, lam: string, bina: string, wazanMudhari: string): string {
    const mudhari = this.applyIilalMudhari(fa, ain, lam, bina, wazanMudhari);
    let base = mudhari.replace(/^يَ/g, "تَ").replace(/^يُ/g, "تُ");
    if (bina === "Naqis" || bina === "Lafif Maqrun" || bina === "Lafif Mafruq") base = base.replace(/[ويى]$/, "");
    else if (bina === "Mudho'af") base = base.replace(new RegExp(`${DAMMA}$`), FATHA);
    else if (bina === "Ajwaf") {
      base = base.replace(new RegExp(`${DAMMA}$`), SUKUN);
      base = base.replace(`ُو${lam}${SUKUN}`, `ُ${lam}${SUKUN}`).replace(`ِي${lam}${SUKUN}`, `ِ${lam}${SUKUN}`).replace(`َا${lam}${SUKUN}`, `َ${lam}${SUKUN}`);
    } else base = base.replace(new RegExp(`${DAMMA}$`), SUKUN);
    return `لَا ${base}`;
  },

  postProcessWord(word: string, bina: string, fa?: string, ain?: string, lam?: string): string {
    if (!word) return word; let res = word;
    if (bina.includes("Mahmuz")) {
      let posisi: "fa" | "ain" | "lam" = "ain";
      if (bina === "Mahmuz Fa") posisi = "fa"; if (bina === "Mahmuz Lam") posisi = "lam";
      res = this.applyMahmuzRules(res, posisi);
    }
    if (bina === "Ajwaf") {
      res = res.replace(/اوِ/g, "ائِ").replace(/ايِ/g, "ائِ").replace(/اوِي/g, "ائِى").replace(/ايِي/g, "ائِى");
      res = res.replace(new RegExp(`${KASRA}وَ?ا`, "g"), `${KASRA}يَا`); res = res.replace(/ا{2,}/g, "ا");
    }
    if (bina === "Mudho'af" && ain && lam && ain === lam) {
      res = res.replace(new RegExp(`${ain}${SUKUN}${lam}`, "g"), `${ain}${SHADDA}`).replace(new RegExp(`${ain}${lam}`, "g"), `${ain}${SHADDA}`);
    }

    // Universal Hamzah Rules
    res = res.replace(/أَ?ا/g, "آ")
             .replace(/ءَ?ا/g, "آ")
             .replace(/أَأْ/g, "آ")
             .replace(/أَأَ/g, "آ")
             .replace(/أَأ/g, "آ")
             .replace(/أَاْ/g, "آ")
             .replace(/أَا/g, "آ")
             .replace(/أَءْ/g, "آ")
             .replace(/أَءَ/g, "آ")
             .replace(/أَء/g, "آ")
             .replace(/ءَأْ/g, "آ")
             .replace(/ءَأَ/g, "آ")
             .replace(/ءَأ/g, "آ")
             .replace(/ءَا/g, "آ");
    res = res.replace(new RegExp(`أ${FATHA}ا`, "g"), "آ");
    res = res.replace(new RegExp(`[أإءا]${FATHA}[أإءؤئ]${SUKUN}?`, "g"), "آ");
    res = res.replace(new RegExp(`[أإءا]${FATHA}ا`, "g"), "آ");

    res = res.replace(new RegExp(`([أإءا])${DAMMA}[أإءؤئ]${SUKUN}?`, "g"), `$1${DAMMA}و${SUKUN}`);
    res = res.replace(new RegExp(`([أإءا])${DAMMA}ؤ${SUKUN}?`, "g"), `$1${DAMMA}و${SUKUN}`);

    res = res.replace(new RegExp(`([أإءا])${KASRA}[أإءؤئ]${SUKUN}?`, "g"), `$1${KASRA}ي${SUKUN}`);
    res = res.replace(new RegExp(`([أإءا])${KASRA}ئ${SUKUN}?`, "g"), `$1${KASRA}ي${SUKUN}`);

    res = res.replace(new RegExp(`${DAMMA}[أإء]`, "g"), `${DAMMA}ؤ`);
    res = res.replace(new RegExp(`${KASRA}[أؤء]`, "g"), `${KASRA}ئ`);
    res = res.replace(new RegExp(`${FATHA}[إء]`, "g"), `${FATHA}أ`);

    // Collapse consecutive duplicate harakats (fatha, damma, kasra, sukun, shadda, etc.)
    res = res.replace(/([\u064e\u064f\u0650\u0652\u0651\u064b\u064c\u064d])\1+/g, "$1");
    // Remove any harakats on Alif Maqsurah (ى)
    res = res.replace(/\u0649[\u064e\u064f\u0650\u0652]+/g, "\u0649");

    return res;
  },

  buatIsimFail(fa: string, ain: string, lam: string, bina: string): string {
    let word = this.replaceRoot(`فَاعِلٌ`, fa, ain, lam);
    if (bina === "Ajwaf") word = word.replace(/او/g, "ائ").replace(/اي/g, "ائ");
    else if (bina === "Naqis" || bina === "Lafif Maqrun" || bina === "Lafif Mafruq") word = `${fa}َا${ain}ٍ`;
    else if (bina === "Mudho'af") word = `${fa}َا${ain}ٌّ`;
    if (bina.includes("Mahmuz")) word = this.applyMahmuzRules(word, bina === "Mahmuz Fa"? "fa" : bina === "Mahmuz Lam"? "lam" : "ain");
    return word;
  },
  buatIsimMaful(fa: string, ain: string, lam: string, bina: string): string {
    let word = this.replaceRoot(`مَفْعُولٌ`, fa, ain, lam);
    if (bina === "Ajwaf") word = ain === "و"? word.replace(`ْوُو`, `ُو`) : word.replace(`ْيُو`, `ِي`);
    else if (bina === "Naqis" || bina === "Lafif Maqrun" || bina === "Lafif Mafruq") {
      word = lam === "و"? word.replace(`ُوٌ`, `ُوٌّ`) : word.replace(`ُويٌ`, `ِيٌّ`);
    }
    if (bina.includes("Mahmuz")) word = this.applyMahmuzRules(word, bina === "Mahmuz Lam"? "lam" : "ain");
    return word;
  },
  buatIsimMusyabihat(fa: string, ain: string, lam: string): string { return this.replaceRoot(`فَعِيلٌ`, fa, ain, lam); },
  buatIsimMusyabihat6(fa: string, ain: string, lam: string, bina: string): string[] { const wazans = ["فَعِيلٌ", "فَعِلٌ", "فَعْلٌ", "فُعَالٌ", "فَعَالٌ", "أَفْعَلُ"]; return wazans.map(w => this.replaceRoot(w, fa, ain, lam)); },
  buatIsimTashghir(fa: string, ain: string, lam: string): string { return `${fa}${DAMMA}${ain}${FATHA}ي${SUKUN}${lam}${TANWIN_DAMMA}`; },
  buatIsimZamanMakan(fa: string, ain: string, lam: string, bina: string, wazanMudhari: string): string {
    const isKasraMudhari = wazanMudhari.includes(KASRA) || wazanMudhari.includes(`ع${KASRA}`) || wazanMudhari.includes("يَفْعِلُ");
    const pattern = (isKasraMudhari || (fa === "و" && bina === "Mitsal"))? `مَفْعِلٌ` : `مَفْعَلٌ`;
    let word = this.replaceRoot(pattern, fa, ain, lam);
    if (bina === "Naqis" || bina === "Lafif Maqrun" || bina === "Lafif Mafruq") word = `مَ${fa}ْ${ain}َى`;
    else if (bina === "Mudho'af") word = `مَ${fa}${FATHA}${ain}${SHADDA}${TANWIN_DAMMA}`;
    else if (bina === "Ajwaf") word = `مَ${fa}َافٌ`.replace("ف", lam);
    return word;
  },
  buatIsimAlat(fa: string, ain: string, lam: string, bina: string, wazanMadhi: string, wazanMudhari: string, babNum: number): string {
    if (bina === "Ajwaf") { let word = this.replaceRoot("مِفْعَلٌ", fa, ain, lam); if (fa === "و") word = word.replace(/^مِو/g, "مِي"); return word; }
    if (bina === "Mitsal" || fa === "و" || fa === "ي") { let word = this.replaceRoot("مِفْعَالٌ", fa, ain, lam); if (fa === "و") word = word.replace(/^مِو/g, "مِي"); return word; }
    if (babNum === 4 || babNum === 5) return "—";
    let wazan = babNum === 3? "مِفْعَالٌ" : "مِفْعَلٌ";
    let word = this.replaceRoot(wazan, fa, ain, lam);
    if (bina === "Naqis" || bina === "Lafif Maqrun" || bina === "Lafif Mafruq") word = wazan === "مِفْعَلٌ"? `مِ${fa}ْ${ain}َى` : `مِ${fa}ْ${ain}َاةٌ`;
    else if (bina === "Mudho'af") word = `مِ${fa}${FATHA}${ain}${SHADDA}${TANWIN_DAMMA}`;
    if (fa === "و") word = word.replace(/^مِو/g, "مِي");
    return word;
  },
  buatIsimMarrah(fa: string, ain: string, lam: string, bina: string): string {
    if (bina === "Ajwaf") return `${fa}َ${ain === "و"? "و" : "ي"}ْ${lam}َةٌ`;
    if (bina === "Naqis" || bina === "Lafif Maqrun" || bina === "Lafif Mafruq") return `${fa}َ${ain}ْ${lam === "و"? "و" : "ي"}َةٌ`;
    if (bina === "Mudho'af") return `${fa}َ${ain}${SHADDA}َةٌ`;
    return `${fa}َ${ain}ْ${lam}َةٌ`;
  },
  buatIsimNau(fa: string, ain: string, lam: string, bina: string): string {
    if (bina === "Ajwaf") return `${fa}ِ${ain === "و"? "و" : "ي"}ْ${lam}َةٌ`;
    if (bina === "Naqis" || bina === "Lafif Maqrun" || bina === "Lafif Mafruq") return `${fa}ِ${ain}ْ${lam === "و"? "و" : "ي"}َةٌ`;
    if (bina === "Mudho'af") return `${fa}ِ${ain}${SHADDA}َةٌ`;
    return `${fa}ِ${ain}ْ${lam}َةٌ`;
  },
  buatShighotDetail(mufrod: string): ShighotDetail { return { mufrod, jamak: [], muntahal: [] }; },

  tasrifIstilahiCustom(dataWazan: DataWazan): TasrifIstilahiData {
    const { fa, ain, lam, babNum = 1 } = dataWazan; const bina = this.detectBina(fa, ain, lam); const wazan = WAZAN_DB[babNum] || WAZAN_DB[1];
    const wazanMadhi = wazan.madhi; const wazanMudhari = wazan.mudhari; const masdar = this.replaceRoot(wazan.masdar, fa, ain, lam);
    const madhi = this.applyIilalMadhi(fa, ain, lam, bina, wazanMadhi, babNum); const mudhari = this.applyIilalMudhari(fa, ain, lam, bina, wazanMudhari);
    const amar = this.applyIilalAmar(fa, ain, lam, bina, wazanMudhari); const nahi = this.applyIilalNahi(fa, ain, lam, bina, wazanMudhari);
    const isimFailMufrod = this.buatIsimFail(fa, ain, lam, bina); const isimMafulMufrod = this.buatIsimMaful(fa, ain, lam, bina);
    const isimMusyabihatMufrod = this.buatIsimMusyabihat(fa, ain, lam); const musyabihat6 = this.buatIsimMusyabihat6(fa, ain, lam, bina);
    const isimZamanMufrod = this.buatIsimZamanMakan(fa, ain, lam, bina, wazanMudhari); const isimMakanMufrod = this.buatIsimZamanMakan(fa, ain, lam, bina, wazanMudhari);
    const isimAlatMufrod = this.buatIsimAlat(fa, ain, lam, bina, wazanMadhi, wazanMudhari, babNum); const isimTashghir = this.buatIsimTashghir(fa, ain, lam);
    const rawResult = { madhi, mudhari, amar, nahi, masdar, isimFail: this.buatShighotDetail(isimFailMufrod), isimMaful: this.buatShighotDetail(isimMafulMufrod), isimMusyabihat: this.buatShighotDetail(isimMusyabihatMufrod), musyabihat6: musyabihat6, isimZaman: this.buatShighotDetail(isimZamanMufrod), isimMakan: this.buatShighotDetail(isimMakanMufrod), isimAlat: this.buatShighotDetail(isimAlatMufrod), marrah: this.buatIsimMarrah(fa, ain, lam, bina), nau: this.buatIsimNau(fa, ain, lam, bina), isimTashghir: isimTashghir };
    const process = (w: string) => this.postProcessWord(w, bina, fa, ain, lam); const cleanDetails = (d: ShighotDetail): ShighotDetail => ({ mufrod: process(d.mufrod), jamak: [], muntahal: [] });
    const isBab4 = babNum === 4; const isBab5 = babNum === 5;
    return { madhi: process(rawResult.madhi), mudhari: process(rawResult.mudhari), masdar: process(rawResult.masdar), isimFail: cleanDetails(rawResult.isimFail), isimMaful: isBab5? { mufrod: "-", jamak: [], muntahal: [] } : cleanDetails(rawResult.isimMaful), isimMusyabihat: cleanDetails(rawResult.isimMusyabihat), musyabihat6: rawResult.musyabihat6.map(process), amar: process(rawResult.amar), nahi: process(rawResult.nahi), isimZaman: cleanDetails(rawResult.isimZaman), isimMakan: cleanDetails(rawResult.isimMakan), isimAlat: isBab4? { mufrod: "-", jamak: [], muntahal: [] } : isBab5? { mufrod: "-", jamak: [], muntahal: [] } : cleanDetails(rawResult.isimAlat), marrah: process(rawResult.marrah), nau: process(rawResult.nau), isimTashghir: process(rawResult.isimTashghir) };
  },

  tasrifLughowi(tasrif: TasrifIstilahiData, fa: string, ain: string, lam: string, bina: string, babNum: number = 1): TasrifLughowi {
    const buildMadhi14 = (baseMadhi: string): string[] => {
      let ainVowel = FATHA; if (babNum === 4 || babNum === 6) ainVowel = KASRA; else if (babNum === 5) ainVowel = DAMMA;
      if (bina === "Mudho'af") { let vowelChar = babNum === 1 || babNum === 3? FATHA : babNum === 2 || babNum === 4 || babNum === 6? KASRA : DAMMA; const rootSplit = `${fa}${FATHA}${ain}${vowelChar}${lam}${SUKUN}`; return [baseMadhi, baseMadhi + "َا", baseMadhi.slice(0, -1) + DAMMA + "وا", baseMadhi + "َتْ", baseMadhi + "َتَا", rootSplit + "ْنَ", rootSplit + "ْتَ", rootSplit + "ْتُمَا", rootSplit + "ْتُمْ", rootSplit + "ْتِ", rootSplit + "ْتُمَا", rootSplit + "ْتُنَّ", rootSplit + "ْتُ", rootSplit + "ْنَا"]; }
      if (bina === "Naqis" || bina === "Lafif Maqrun" || bina === "Lafif Mafruq") {
        const weak = lam === "و"? "و" : "ي";
        if (ainVowel === KASRA) return [baseMadhi, `${fa}${FATHA}${ain}${KASRA}يَا`, `${fa}${FATHA}${ain}${DAMMA}وا`, `${fa}${FATHA}${ain}${KASRA}يَتْ`, `${fa}${FATHA}${ain}${KASRA}يَتَا`, `${fa}${FATHA}${ain}${KASRA}يْنَ`, `${fa}${FATHA}${ain}${KASRA}يْتَ`, `${fa}${FATHA}${ain}${KASRA}يْتُمَا`, `${fa}${FATHA}${ain}${KASRA}يْتُمْ`, `${fa}${FATHA}${ain}${KASRA}يْتِ`, `${fa}${FATHA}${ain}${KASRA}يْتُمَا`, `${fa}${FATHA}${ain}${KASRA}يْتُنَّ`, `${fa}${FATHA}${ain}${KASRA}يْتُ`, `${fa}${FATHA}${ain}${KASRA}يْنَا`];
        else if (ainVowel === DAMMA) return [baseMadhi, `${fa}${FATHA}${ain}${DAMMA}وَا`, `${fa}${FATHA}${ain}${DAMMA}وا`, `${fa}${FATHA}${ain}${DAMMA}وَتْ`, `${fa}${FATHA}${ain}${DAMMA}وَتَا`, `${fa}${FATHA}${ain}${DAMMA}وْنَ`, `${fa}${FATHA}${ain}${DAMMA}وْتَ`, `${fa}${FATHA}${ain}${DAMMA}وْتُمَا`, `${fa}${FATHA}${ain}${DAMMA}وْتُمْ`, `${fa}${FATHA}${ain}${DAMMA}وْتِ`, `${fa}${FATHA}${ain}${DAMMA}وْتُمَا`, `${fa}${FATHA}${ain}${DAMMA}وْتُنَّ`, `${fa}${FATHA}${ain}${DAMMA}وْتُ`, `${fa}${FATHA}${ain}${DAMMA}وْنَا`];
        else return [baseMadhi, weak === "و"? `${fa}${FATHA}${ain}${FATHA}وَا` : `${fa}${FATHA}${ain}${FATHA}يَا`, `${fa}${FATHA}${ain}${FATHA}و${SUKUN}ا`, `${fa}${FATHA}${ain}${FATHA}ت${SUKUN}`, `${fa}${FATHA}${ain}${FATHA}تَا`, `${fa}${FATHA}${ain}${FATHA}${weak}${SUKUN}نَ`, `${fa}${FATHA}${ain}${FATHA}${weak}${SUKUN}تَ`, `${fa}${FATHA}${ain}${FATHA}${weak}${SUKUN}تُمَا`, `${fa}${FATHA}${ain}${FATHA}${weak}${SUKUN}تُمْ`, `${fa}${FATHA}${ain}${FATHA}${weak}${SUKUN}تِ`, `${fa}${FATHA}${ain}${FATHA}${weak}${SUKUN}تُمَا`, `${fa}${FATHA}${ain}${FATHA}${weak}${SUKUN}تُنَّ`, `${fa}${FATHA}${ain}${FATHA}${weak}${SUKUN}تُ`, `${fa}${FATHA}${ain}${FATHA}${weak}${SUKUN}نَا`];
      }
      if (bina === "Ajwaf") { let leadVowel = KASRA; if (ain === "و" && babNum === 1) leadVowel = DAMMA; const base9 = `${fa}${leadVowel}${lam}${SUKUN}`; return [baseMadhi, baseMadhi + "ا", `${fa}${FATHA}ا${lam}${DAMMA}وا`, baseMadhi + "تْ", baseMadhi + "تَا", base9 + "ْنَ", base9 + "ْتَ", base9 + "ْتُمَا", base9 + "ْتُمْ", base9 + "ْتِ", base9 + "ْتُمَا", base9 + "ْتُنَّ", base9 + "ْتُ", base9 + "ْنَا"]; }
      const stem = `${fa}${FATHA}${ain}${ainVowel}${lam}`; return [stem + FATHA, stem + "َا", stem + DAMMA + "وا", stem + FATHA + "تْ", stem + FATHA + "تَا", stem + SUKUN + "ْنَ", stem + SUKUN + "ْتَ", stem + SUKUN + "ْتُمَا", stem + SUKUN + "ْتُمْ", stem + SUKUN + "ْتِ", stem + SUKUN + "ْتُمَا", stem + SUKUN + "ْتُنَّ", stem + SUKUN + "ْتُ", stem + SUKUN + "ْنَا"];
    };

    const buildMudhari14 = (baseMudhari: string): string[] => {
      let ainVowelMudhari = DAMMA; if (babNum === 2 || babNum === 6) ainVowelMudhari = KASRA; else if (babNum === 3 || babNum === 4) ainVowelMudhari = FATHA;
      const rawStem = baseMudhari.slice(1); const stemWithSukun = rawStem.replace(new RegExp(`${DAMMA}$`), SUKUN); const stemNoEndVowel = rawStem.substring(0, rawStem.length - 1);
      if (bina === "Mudho'af") { const vowelChar = ainVowelMudhari; const stem = `${fa}${vowelChar}${ain}${SHADDA}`; return [`يَ${stem}${DAMMA}`, `يَ${stem}${FATHA}انِ`, `يَ${stem}${DAMMA}ونَ`, `تَ${stem}${DAMMA}`, `تَ${stem}${FATHA}انِ`, `يَ${fa}${SUKUN}${ain}${vowelChar}${lam}${SUKUN}ْنَ`, `تَ${stem}${DAMMA}`, `تَ${stem}${FATHA}انِ`, `تَ${stem}${DAMMA}ونَ`, `تَ${stem}${KASRA}ينَ`, `تَ${stem}${FATHA}انِ`, `تَ${fa}${SUKUN}${ain}${vowelChar}${lam}${SUKUN}ْنَ`, `أَ${stem}${DAMMA}`, `نَ${stem}${DAMMA}`]; }
      if (bina === "Naqis" || bina === "Lafif Maqrun" || bina === "Lafif Mafruq") {
  const endsWithWaw = baseMudhari.endsWith("و") || baseMudhari.endsWith(`و${DAMMA}`);
  const endsWithAlif = baseMudhari.endsWith("ى") || baseMudhari.endsWith(`َى`);
  const endsWithYa = baseMudhari.endsWith("ي") || baseMudhari.endsWith(`ي${KASRA}`);

  const prefixVowel = baseMudhari.charAt(1);
  const prefY = "ي" + prefixVowel;
  const prefT = "ت" + prefixVowel;
  const prefA = "أ" + prefixVowel;
  const prefN = "ن" + prefixVowel;
  const stemBody = (bina === "Lafif Mafruq" && fa === "و")? ain : `${fa}${SUKUN}${ain}`;

  if (endsWithWaw) return [
    `${prefY}${stemBody}${DAMMA}و`, `${prefY}${stemBody}${DAMMA}وَانِ`, `${prefY}${stemBody}${DAMMA}ونَ`,
    `${prefT}${stemBody}${DAMMA}و`, `${prefT}${stemBody}${DAMMA}وَانِ`, `${prefY}${stemBody}${DAMMA}و${SUKUN}نَ`,
    `${prefT}${stemBody}${DAMMA}و`, `${prefT}${stemBody}${DAMMA}وَانِ`, `${prefT}${stemBody}${DAMMA}ونَ`,
    `${prefT}${stemBody}${KASRA}ينَ`, `${prefT}${stemBody}${DAMMA}وَانِ`, `${prefT}${stemBody}${DAMMA}و${SUKUN}نَ`,
    `${prefA}${stemBody}${DAMMA}و`, `${prefN}${stemBody}${DAMMA}و`
  ];

  else if (endsWithAlif) return [
    `${prefY}${stemBody}${FATHA}ى`, `${prefY}${stemBody}${FATHA}يَانِ`, `${prefY}${stemBody}${FATHA}وْنَ`,
    `${prefT}${stemBody}${FATHA}ى`, `${prefT}${stemBody}${FATHA}يَانِ`, `${prefY}${stemBody}${FATHA}يْنَ`,
    `${prefT}${stemBody}${FATHA}ى`, `${prefT}${stemBody}${FATHA}يَانِ`, `${prefT}${stemBody}${FATHA}وْنَ`,
    `${prefT}${stemBody}${FATHA}يْنَ`, `${prefT}${stemBody}${FATHA}يَانِ`, `${prefT}${stemBody}${FATHA}يْنَ`,
    `${prefA}${stemBody}${FATHA}ى`, `${prefN}${stemBody}${FATHA}ى`
  ];

  else { // endsWithYa
    return [
      `${prefY}${stemBody}${KASRA}ي`, `${prefY}${stemBody}${KASRA}يَانِ`, `${prefY}${stemBody}${DAMMA}ونَ`,
      `${prefT}${stemBody}${KASRA}ي`, `${prefT}${stemBody}${KASRA}يَانِ`, `${prefY}${stemBody}${KASRA}يْنَ`,
      `${prefT}${stemBody}${KASRA}ي`, `${prefT}${stemBody}${KASRA}يَانِ`, `${prefT}${stemBody}${DAMMA}ونَ`,
      `${prefT}${stemBody}${KASRA}inَ`, `${prefT}${stemBody}${KASRA}يَانِ`, `${prefT}${stemBody}${KASRA}يْنَ`,
      `${prefA}${stemBody}${KASRA}ي`, `${prefN}${stemBody}${KASRA}ي`
    ];
  }
}

const prefY = baseMudhari.charAt(0) + baseMudhari.charAt(1);
const prefT = prefY.replace("ي", "ت"); const prefA = prefY.replace("ي", "أ"); const prefN = prefY.replace("ي", "ن");
const baseBody = baseMudhari.substring(2, baseMudhari.length - 1);
const shortenAjwafPlural = (v: string) => v.replace(new RegExp(`و${lam}[\u0652]*ْنَ$`), `${lam}${SUKUN}ْنَ`).replace(new RegExp(`ي${lam}[\u0652]*ْنَ$`), `${lam}${SUKUN}ْنَ`).replace(new RegExp(`ا${lam}[\u0652]*ْنَ$`), `${lam}${SUKUN}ْنَ`);
const resList = [prefY + baseBody + DAMMA, prefY + baseBody + FATHA + "انِ", prefY + baseBody + DAMMA + "ونَ", prefT + baseBody + DAMMA, prefT + baseBody + FATHA + "انِ", prefY + baseBody + SUKUN + "ْنَ", prefT + baseBody + DAMMA, prefT + baseBody + FATHA + "انِ", prefT + baseBody + DAMMA + "ونَ", prefT + baseBody + KASRA + "ينَ", prefT + baseBody + FATHA + "anِ", prefT + baseBody + SUKUN + "ْنَ", prefA + baseBody + DAMMA, prefN + baseBody + DAMMA];
if (bina === "Ajwaf") { resList[5] = shortenAjwafPlural(resList[5]); resList[11] = shortenAjwafPlural(resList[11]); }
      return resList;
    };

    const buildAmar12 = (baseAmar: string): string[] => {
  const LI_PREFIX = "\u0644\u0650"; // لِ

  // Fungsi internal buat jazm, gak perlu dipisah lagi
  const makeMajzum = (verb: string, index: number): string => {
    if (index === 5 || index === 11) return verb;
    if (verb.endsWith("انِ")) return verb.replace(/انِ$/, "ا");
    if (verb.endsWith("ونَ")) return verb.replace(/ونَ$/, "وا");
    if (verb.endsWith("ينَ")) return verb.replace(/ينَ$/, "ي");
    if (bina === "Naqis" || bina === "Lafif Maqrun" || bina === "Lafif Mafruq") { 
      if (index === 0 || index === 3 || index === 6) return verb.replace(/[ويى]$/, ""); 
    }
    if (bina === "Ajwaf") { 
      if (index === 0 || index === 3 || index === 6) { 
        let cleanVerb = verb.replace(new RegExp(`${DAMMA}$`), SUKUN); 
        const regexWaw = new RegExp(`و${lam}${SUKUN}$`); 
        const regexYa = new RegExp(`ي${lam}${SUKUN}$`); 
        const regexAlif = new RegExp(`ا${lam}${SUKUN}$`); 
        if (regexWaw.test(cleanVerb)) return cleanVerb.replace(regexWaw, `${lam}${SUKUN}`); 
        if (regexYa.test(cleanVerb)) return cleanVerb.replace(regexYa, `${lam}${SUKUN}`); 
        if (regexAlif.test(cleanVerb)) return cleanVerb.replace(regexAlif, `${lam}${SUKUN}`); 
        return cleanVerb; 
      } 
    }
    if (bina === "Mudho'af") { 
      if (index === 0 || index === 3 || index === 6) return verb.replace(new RegExp(`${DAMMA}$`), FATHA); 
    }
    if (index === 0 || index === 3 || index === 6) return verb.replace(new RegExp(`${DAMMA}$`), SUKUN);
    return verb;
  };

  // Fungsi internal buat Amar Mukhotob 6
  const buildAmarMukhotob6 = (): string[] => {
    if (bina === "Naqis" || bina === "Lafif Maqrun" || bina === "Lafif Mafruq") {
      const weak = lam === "و"? "و" : "ي"; 
      const stemNoVowel = baseAmar.substring(0, baseAmar.length - 1); 
      const vowel = baseAmar.substring(baseAmar.length - 1);
      const plural = vowel === FATHA? `${stemNoVowel}${FATHA}وْا` : `${stemNoVowel}${DAMMA}وا`; 
      const anti = vowel === FATHA? `${stemNoVowel}${FATHA}يْ` : `${stemNoVowel}${KASRA}ي`; 
      const dual = `${stemNoVowel}${weak}${FATHA}ا`; 
      const pluralFem = `${stemNoVowel}${vowel}${weak}${SUKUN}نَ`;
      return [baseAmar, dual, plural, anti, dual, pluralFem];
    }
    if (bina === "Mudho'af") { 
      const stem = baseAmar.slice(0, -1); 
      const vowelChar = baseAmar.includes(DAMMA)? DAMMA : baseAmar.includes(KASRA)? KASRA : FATHA; 
      const hamzahVal = vowelChar === DAMMA? DAMMA : KASRA; 
      const splitPrefix = `ا${hamzahVal}${fa}${SUKUN}${ain}${vowelChar}${lam}`; 
      return [baseAmar, stem + FATHA + "ا", stem + DAMMA + "وا", stem + KASRA + "ي", stem + FATHA + "ا", splitPrefix + SUKUN + "ْنَ"]; 
    }
    if (bina === "Ajwaf") { 
      let longVowel = ain === "و"? "ُو" : "ِي"; 
      if (baseAmar.includes("َ")) longVowel = "َا"; 
      else if (baseAmar.includes("ِ")) longVowel = "ِي"; 
      else if (baseAmar.includes("ُ")) longVowel = "ُو"; 
      const longStem = `${fa}${longVowel}${lam}`; 
      const cleanBase = baseAmar.replace(new RegExp(`${SUKUN}`, "g"), ""); 
      return [baseAmar, longStem + FATHA + "ا", longStem + DAMMA + "وا", longStem + KASRA + "ي", longStem + FATHA + "ا", cleanBase + "ْنَ"]; 
    }
    const stemNoSukun = baseAmar.endsWith(SUKUN)? baseAmar.slice(0, -1) : baseAmar;
    return [baseAmar, stemNoSukun + FATHA + "ا", stemNoSukun + DAMMA + "وا", stemNoSukun + KASRA + "ي", stemNoSukun + FATHA + "ا", stemNoSukun + SUKUN + "ْنَ"];
  };

  // 1. AMAR GHOIB 6
  const amrGhoib = mudhari14.slice(0, 6).map((verb, idx) => LI_PREFIX + makeMajzum(verb, idx));

  // 2. AMAR MUKHOTOB 6
  const amrMukhotob = buildAmarMukhotob6();

  let result = [...amrGhoib,...amrMukhotob];

  if (bina.includes("Mahmuz")) {
    result = result.map((verb) => this.applyMahmuzRules(verb));
  }
  return result;
};

const buildNahi12 = (): string[] => {
  const makeMajzum = (verb: string, index: number): string => {
    if (index === 5 || index === 11) return verb;
    if (verb.endsWith("انِ")) return verb.replace(/انِ$/, "ا");
    if (verb.endsWith("ونَ")) return verb.replace(/ونَ$/, "وا");
    if (verb.endsWith("ينَ")) return verb.replace(/ينَ$/, "ي");
    if (bina === "Naqis" || bina === "Lafif Maqrun" || bina === "Lafif Mafruq") { if (index === 0 || index === 3 || index === 6) return verb.replace(/[ويى]$/, ""); }
    if (bina === "Ajwaf") { if (index === 0 || index === 3 || index === 6) { let cleanVerb = verb.replace(new RegExp(`${DAMMA}$`), SUKUN); const regexWaw = new RegExp(`و${lam}${SUKUN}$`); const regexYa = new RegExp(`ي${lam}${SUKUN}$`); const regexAlif = new RegExp(`ا${lam}${SUKUN}$`); if (regexWaw.test(cleanVerb)) return cleanVerb.replace(regexWaw, `${lam}${SUKUN}`); if (regexYa.test(cleanVerb)) return cleanVerb.replace(regexYa, `${lam}${SUKUN}`); if (regexAlif.test(cleanVerb)) return cleanVerb.replace(regexAlif, `${lam}${SUKUN}`); return cleanVerb; } }
    if (bina === "Mudho'af") { if (index === 0 || index === 3 || index === 6) return verb.replace(new RegExp(`${DAMMA}$`), FATHA); }
    if (index === 0 || index === 3 || index === 6) return verb.replace(new RegExp(`${DAMMA}$`), SUKUN);
    return verb;
  };
  
  const result = mudhari14.slice(0, 12).map((verb, idx) => "لَا " + makeMajzum(verb, idx));

  if (bina.includes("Mahmuz")) {
    return result.map((verb) => this.applyMahmuzRules(verb));
  }
  return result;
};

    const tasrifIsim6 = (bentukMufrod: string): string[] => {
      if (!bentukMufrod || bentukMufrod === "—") return ["—", "—", "—", "—", "—", "—"];
      if ((bina === "Naqis" || bina === "Lafif Maqrun" || bina === "Lafif Mafruq") && bentukMufrod.endsWith("ٍ")) {
        const baseIsim = `${fa}َا${ain}ِ`;
        return [bentukMufrod, baseIsim + "يَانِ", `${fa}َا${ain}ُونَ`, baseIsim + "يَةٌ", baseIsim + "يَتَانِ", baseIsim + "يَاتٌ"];
      }
      const base = bentukMufrod.replace(/[ًٌٍ]$/, "");
      return [bentukMufrod, base + FATHA + "anِ", base + DAMMA + "ونَ", base + FATHA + "ةٌ", base + FATHA + "تَانِ", base + FATHA + "اتٌ"];
    };

    const madhi14 = buildMadhi14(tasrif.madhi);
    const mudhari14 = buildMudhari14(tasrif.mudhari);
    const amar12 = buildAmar12(tasrif.amar);
    const nahi12 = buildNahi12();
    const isLughowiBab4 = babNum === 4; const isLughowiBab5 = babNum === 5;

    const isimFail6 = tasrifIsim6(tasrif.isimFail.mufrod);
    const isimMaful6 = isLughowiBab5? ["-", "-", "-"] : tasrifIsim6(tasrif.isimMaful.mufrod);
    const isimZaman6 = tasrifIsim6(tasrif.isimZaman.mufrod);
    const isimMakan6 = tasrifIsim6(tasrif.isimMakan.mufrod);
    const isimAlat6 = isLughowiBab4? ["-", "-", "-"] : isLughowiBab5? ["(-)", "(-)", "(-)", "(-)", "(-)", "(-)"] : tasrifIsim6(tasrif.isimAlat.mufrod);
    const isimMusyabihat6 = tasrifIsim6(tasrif.isimMusyabihat.mufrod);

    const processArr = (arr: string[]) => arr.map(w => this.postProcessWord(w, bina, fa, ain, lam));

    return {
      madhi14: processArr(madhi14), mudhari14: processArr(mudhari14), amar12: processArr(amar12), nahi12: processArr(nahi12),
      isimFail6: processArr(isimFail6), isimMaful6: processArr(isimMaful6), isimZaman6: processArr(isimZaman6),
      isimMakan6: processArr(isimMakan6), isimAlat6: processArr(isimAlat6), isimMusyabihat6: processArr(isimMusyabihat6),
    };
  },

  fmtList(patterns: string[], fa: string, ain: string, lam: string, fn: any, bk: string): string { if (!patterns.length) return "—"; return patterns.map(p => fn(p, fa, ain, lam, bk)).filter(Boolean).join(" / "); },

  replaceForIsimFail(pattern: string, fa: string, ain: string, lam: string, bk: string): string {
    let result = "";
    if (pattern === "فَاعِلُونَ") {
      if (bk === "naqish" || bk.startsWith("lafif")) result = `${fa}َا${ain}ُونَ`;
      else if (bk === "ajwaf") result = `${fa}َائِ${lam}ُونَ`;
      else if (bk === "mudaaf") result = `${fa}َا${lam}ُّونَ`;
      else result = `${fa}َا${ain}ِ${lam}ُونَ`;
    } else if (pattern === "فَوَاعِلُ") {
      if (bk === "mudaaf") result = `${fa}َوَا${lam}ُّ`;
      else if (bk === "ajwaf") result = `${fa}َوَائِ${lam}ُ`;
      else if (bk === "mitsal") result = `أَوَا${ain}ِ${lam}ُ`;
      else if (bk === "naqish") result = `${fa}َوَا${ain}ٍ`;
      else if (bk.startsWith("lafif")) result = bk === "lafif_mafruq" || fa === "و"? `أَوَا${ain}ٍ` : `${fa}َوَا${ain}ٍ`;
      else result = `${fa}َوَا${ain}ِ${lam}ُ`;
    } else if (bk === "mudaaf" && pattern === "فَعَلَةٌ") { result = `${fa}َ${ain}َ${lam}َةٌ`; }
    else if (bk === "mudaaf" && pattern === "فُعَّلٌ") { result = `${fa}ُ${ain}َّ${lam}ٌ`; }
    else if ((bk === "naqish" || bk.startsWith("lafif")) && pattern === "فُعَلَةٌ") { result = `${fa}ُ${ain}َاةٌ`; }
    else if ((bk === "naqish" || bk.startsWith("lafif")) && pattern === "فُعَّالٌ") { result = `${fa}ُ${ain}َّاءٌ`; }
    else if ((bk === "naqish" || bk.startsWith("lafif")) && pattern === "فُعَّلٌ") { result = `${fa}ُ${ain}ًّى`; }
    else if (bk === "ajwaf" && pattern === "فَعَلَةٌ") { result = `${fa}َ${ain}َ${lam}َةٌ`; }
    else { result = this.replaceRoot(pattern, fa, ain, lam); }
    if (result.startsWith("وَوَ") || result.startsWith("وَو")) result = "أَ" + result.slice(1);
    result = result.replace(/ُ[أإء]/g, "ُؤ");
    if (bk === "ajwaf") result = result.replace(/اوِ/g, "ائِ").replace(/ايِ/g, "ائِ");
    result = result.replace(/[أإؤئء]([ٌُ])(?=$|\s)/g, "ء$1");
    return result;
  },

  replaceForIsimMaful(pattern: string, fa: string, ain: string, lam: string, bk: string): string {
    let result = this.replaceRoot(pattern, fa, ain, lam);
    if ((bk === "naqish" || bk.startsWith("lafif")) && pattern === "مَفَاعِيُّ") result = `مَ${fa}َا${ain}ِيُّ`;
    result = result.replace(/مَوَاوِيُّ/g, "مَوَافِيُّ").replace(/مَحَايِيُّ/g, "مَحَائِيُّ");
    result = result.replace(/([\u0621-\u064a])[أإء]ِ/g, "$1ئِ");
    result = result.replace(/أَأْ/g, "آ").replace(/أَاْ/g, "آ").replace(/أَأَ/g, "آ");
    result = result.replace(/ُ[أإء]/g, "ُؤ");
    if (bk === "ajwaf") result = result.replace(/اوِ/g, "ائِ").replace(/ايِ/g, "ائِ");
    if (bk === "naqish" || bk.startsWith("lafif")) result = result.replace(/ِيْ?[يio]ٌ?$/g, "ِيُّ");
    result = result.replace(/[أإؤئء]([ٌُ])(?=$|\s)/g, "ء$1");
    return result;
  },

  replaceForZM(pattern: string, fa: string, ain: string, lam: string, bk: string): string {
    if (bk === "naqish" || bk.startsWith("lafif")) {
      if (pattern === "مَفَاعِ" || pattern === "مَفَاعٍ") return `مَ${fa}َا${ain}ٍ`;
      if (pattern === "مَفَاعِيل") return `مَ${fa}َا${ain}ِي${lam}`;
    }
    if (bk === "mudaaf" && pattern === "مَفَاعِل") return `مَ${fa}َا${lam}ّ`;
    const result = this.replaceRoot(pattern, fa, ain, lam);
    if (bk === "ajwaf") return result.replace(/اوِ/g, "ائِ").replace(/ايِ/g, "ائِ");
    return result;
  },

  replaceForIsimAlat(pattern: string, fa: string, ain: string, lam: string, bk: string): string {
    const cp = this.cd(pattern);
    if (bk === "naqish" || bk.startsWith("lafif")) {
      if (cp === "مفاعيل") return `مَ${fa}َا${ain}ِيُّ`;
      if (cp === "مفاعل") return `مَ${fa}َا${ain}ٍ`;
    }
    if (bk === "ajwaf") {
      if (cp === "مفاعيل") return `مَ${fa}َائِي${lam}ُ`;
      if (cp === "mفاعل" || cp === "مفاعل") return `مَ${fa}َائِ${lam}ُ`;
    }
    if (bk === "mudaaf" && cp === "مفاعل") return `مَ${fa}َا${lam}ّ`;
    const result = this.replaceRoot(pattern, fa, ain, lam);
    return result.replace(/[أإؤئء]([ٌُ])(?=$|\s)/g, "ء$1");
  },

  analyzeIsimFailPlural(entry: DictionaryEntry): PluralIsimFail {
    const { fa, ain, lam } = entry.root; const cFa = this.cd(fa), cAin = this.cd(ain), cLam = this.cd(lam); const bk = this.getPluralBinaKey(entry.bina);
    const rfiFn = (p: string, f: string, a: string, l: string, b: string) => this.replaceForIsimFail(p, f, a, l, b);
    let qillah = "—", katsroh = "—", muntahal = "—", contoh = "", ilalRule = "", explanation = "";
    switch (bk) {
      case "sahih": qillah = this.fmtList(["أَفْعِلَةٌ", "أَفْعَالٌ"], cFa, cAin, cLam, rfiFn, bk); katsroh = this.fmtList(["فُعَّالٌ", "فُعَّلٌ", "فَعَلَةٌ"], cFa, cAin, cLam, rfiFn, bk); muntahal = this.fmtList(["فَوَاعِلُ"], cFa, cAin, cLam, rfiFn, bk); contoh = "كَاتِب ← كُتَّابٌ / كُتَّبٌ / كَتَبَةٌ / كَوَاتِبُ"; ilalRule = "Tanpa i'lal"; explanation = "Isim Fa'il bina Shohih: Qillah أَفْعِلَة / أَفْعَال, Katsroh فُعَّال / فُعَّل / فَعَلَة, Muntahal فَوَاعِل"; break;
      case "ajwaf": qillah = this.fmtList(["فَاعِلُونَ"], cFa, cAin, cLam, rfiFn, bk); katsroh = this.fmtList(["فَعَلَةٌ", "فُعَّالٌ", "فُعَّلٌ"], cFa, cAin, cLam, rfiFn, bk); muntahal = this.fmtList(["فَوَاعِلُ"], cFa, cAin, cLam, rfiFn, bk); contoh = "قَائِل ← قَائِلُونَ / قَوَمَةٌ / قُوَّالٌ / قَوَائِلُ"; ilalRule = "Ain kembali ke huruf asal waw/ya"; explanation = "Isim Fa'il bina Ajwaf: Qillah فَاعِلُونَ, Muntahal فَوَاعِل dengan ain jadi hamzah"; break;
      case "mitsal": qillah = this.fmtList(["فَاعِلُونَ"], cFa, cAin, cLam, rfiFn, bk); katsroh = this.fmtList(["فُعَّالٌ", "فُعَّلٌ", "فَعَلَةٌ"], cFa, cAin, cLam, rfiFn, bk); muntahal = this.fmtList(["فَوَاعِلُ"], cFa, cAin, cLam, rfiFn, bk); contoh = "وَاعِد ← وَاعِدُونَ / وُعَّادٌ / أَوَاعِدُ"; ilalRule = "Fa' waw jadi hamzah di Muntahal"; explanation = "Isim Fa'il bina Mitsal: Qillah فَاعِلُونَ, Muntahal فَوَاعِل fa' waw → hamzah"; break;
      case "naqish": qillah = this.fmtList(["فَاعِلُونَ"], cFa, cAin, cLam, rfiFn, bk); katsroh = this.fmtList(["فُعَلَةٌ", "فُعَّالٌ", "فُعَّلٌ"], cFa, cAin, cLam, rfiFn, bk); muntahal = this.fmtList(["فَوَاعِلُ"], cFa, cAin, cLam, rfiFn, bk); contoh = "قَاضٍ ← قَاضُونَ / قُضَاةٌ / قُضَّاءٌ / قَوَاضٍ"; ilalRule = "Lam dibuang, ain dikasroh tanwin"; explanation = "Isim Fa'il bina Naqis: Qillah فَاعِلُونَ, Katsroh فُعَلَة / فُعَّال / فُعَّل, Muntahal فَوَاعِل"; break;
      case "mudaaf": qillah = this.fmtList(["أَمْدَادٌ"], cFa, cAin, cLam, rfiFn, bk); katsroh = this.fmtList(["فَعَلَةٌ", "فُعَّلٌ", "فُعَّالٌ"], cFa, cAin, cLam, rfiFn, bk); muntahal = this.fmtList(["فَوَاعِلُ"], cFa, cAin, cLam, rfiFn, bk); contoh = "مَادّ ← أَمْدَادٌ / مَدَةٌ / مَوَادُّ"; ilalRule = "Idgham ain+lam"; explanation = "Isim Fa'il bina Mudho'af: Qillah أَفْعَال, Muntahal فَوَاعِل dengan idgham"; break;
      case "mahmuz": qillah = this.fmtList(["فَاعِلُونَ"], cFa, cAin, cLam, rfiFn, bk); katsroh = this.fmtList(["فُعَّالٌ", "فُعَّلٌ", "فَعَلَةٌ"], cFa, cAin, cLam, rfiFn, bk); muntahal = this.fmtList(["فَوَاعِلُ"], cFa, cAin, cLam, rfiFn, bk); contoh = "آكِل ← آكِلُونَ / أُكَّالٌ / أَوَاكِلُ"; ilalRule = "Penyesuaian hamzah"; explanation = "Isim Fa'il bina Mahmuz: sama seperti Shohih + penyesuaian hamzah"; break;
      default: qillah = this.fmtList(["فَاعِلُونَ"], cFa, cAin, cLam, rfiFn, bk); katsroh = this.fmtList(["فُعَلَةٌ", "فُعَّالٌ", "فُعَّلٌ"], cFa, cAin, cLam, rfiFn, bk); muntahal = this.fmtList(["فَوَاعِلُ"], cFa, cAin, cLam, rfiFn, bk); contoh = "طَاوٍ ← طَاوُونَ / طُوَاةٌ / أَوَاوٍ"; ilalRule = "Gabungan hukum Naqis + Mitsal"; explanation = "Isim Fa'il bina Lafif: Qillah فَاعِلُونَ, Katsroh فُعَلَة / فُعَّال / فُعَّل, Muntahal فَوَاعِل"; break;
    }
    const processWord = (word: string) => {
      if (!word || word === "—" || word === "-") return "—";
      return word.split("/").map(w => this.postProcessWord(w.trim(), entry.bina || "Shohih", fa, ain, lam)).join(" / ");
    };
    return { qillah: processWord(qillah), katsroh: processWord(katsroh), muntahal: processWord(muntahal), explanation: `${explanation}\n• Kaidah: ${ilalRule}\n• Contoh: ${contoh}` };
  },

  analyzeIsimMafulPlural(entry: DictionaryEntry): PluralIsimMaful {
    if (entry.babNum === 5) return {qillah:"—", katsroh:"—", muntahal:"—", explanation: "Bab 5 fi'il lazim tidak punya Isim Maf'ul"};
    if (entry.isLazim) return {qillah:"—", katsroh:"—", muntahal:"—", explanation: "Fi'il lazim tidak punya Isim Maf'ul"};
    const { fa, ain, lam } = entry.root; const cFa = this.cd(fa), cAin = this.cd(ain), cLam = this.cd(lam); const bk = this.getPluralBinaKey(entry.bina);
    const muntahalPattern = (bk === "naqish" || bk.startsWith("lafif"))? "مَفَاعِيُّ" : "مَفَاعِيل";
    const muntahal = this.fmtList([muntahalPattern], cFa, cAin, cLam, this.replaceForIsimMaful.bind(this), bk);
    let explanation = `Bina ${bk}: Muntahal ${muntahalPattern}`;
    if(bk === "ajwaf") explanation += ". Ain kembali ke huruf asal";
    if(bk === "mudaaf") explanation += ". Fakk idgham";
    const processWord = (word: string) => {
      if (!word || word === "—" || word === "-") return "—";
      return word.split("/").map(w => this.postProcessWord(w.trim(), entry.bina || "Shohih", fa, ain, lam)).join(" / ");
    };
    return { qillah:"—", katsroh:"—", muntahal: processWord(muntahal), explanation };
  },

  analyzeIsimZamanMakanPlural(entry: DictionaryEntry): PluralIsimZamanMakan {
    const { fa, ain, lam } = entry.root; const cFa = this.cd(fa), cAin = this.cd(ain), cLam = this.cd(lam); const bk = this.getPluralBinaKey(entry.bina);
    const isFaMitsal = cFa === "و"; const defaultMufrod = isFaMitsal? `مَ${cFa}ْ${cAin}ِ${cLam}ٌ` : `مَ${cFa}ْ${cAin}َ${cLam}ٌ`;
    let muntahal = "—", contoh = "", ilalRule = "", explanation = "";
    const pattern = (bk === "naqish" || bk.startsWith("lafif"))? "مَفَاعٍ" : "مَفَاعِل";
    muntahal = this.fmtList([pattern], cFa, cAin, cLam, this.replaceForZM.bind(this), bk);
    if(bk === "sahih"){ contoh = "مَسْجِد ← مَسَاجِد"; ilalRule = "Tanpa i'lal"; explanation = "Bina Shohih: Muntahal مَفَاعِل"; }
    else if(bk === "ajwaf"){ contoh = "مَقَام ← مَقَاوِم"; ilalRule = "Ain kembali ke huruf asal"; explanation = "Bina Ajwaf: alif → waw/ya"; }
    else if(bk === "mitsal"){ contoh = "مَوْعِد ← مَوَاعِد"; ilalRule = "Waw fa' tetap"; explanation = "Bina Mitsal: waw tetap"; }
    else if(bk === "naqish"){ contoh = "مَرْمَى ← مَرَامٍ"; ilalRule = "Lam dibuang"; explanation = "Bina Naqis: Muntahal مَفَاعٍ"; }
    else if(bk === "mudaaf"){ contoh = "مَقَرّ ← مَقَارّ"; ilalRule = "Idgham"; explanation = "Bina Mudho'af: Muntahal مَفَاعِل dengan idgham"; }
    else if(bk === "mahmuz"){ contoh = "مَبْدَأ ← مَبَادِئ"; ilalRule = "Hamzah disesuaikan"; explanation = "Bina Mahmuz: Muntahal مَفَاعِل"; }
    else { contoh = "مَوْقَى ← مَوَاقٍ"; ilalRule = "Lam dibuang"; explanation = "Bina Lafif: Muntahal مَفَاعٍ"; }
    const processWord = (word: string) => {
      if (!word || word === "—" || word === "-") return "—";
      return word.split("/").map(w => this.postProcessWord(w.trim(), entry.bina || "Shohih", fa, ain, lam)).join(" / ");
    };
    const finalMufrod = this.postProcessWord(defaultMufrod, entry.bina || "Shohih", fa, ain, lam);
    return { mufrod: finalMufrod, qillah:"—", katsroh:"—", muntahal: processWord(muntahal), explanation: `${explanation}\n• Kaidah: ${ilalRule}\n• Contoh: ${contoh}` };
  },

  analyzeIsimAlatPlural(entry: DictionaryEntry): PluralIsimAlat {
    if (entry.babNum === 4) return {mufrod:"—", qillah:"—", katsroh:"—", muntahal:"—", explanation: "Bab 4 tidak punya Isim Alat"};
    if (entry.babNum === 5) return {mufrod:"—", qillah:"—", katsroh:"—", muntahal:"—", explanation: "Bab 5 tidak punya Isim Alat"};
    const { fa, ain, lam } = entry.root; const cFa = this.cd(fa), cAin = this.cd(ain), cLam = this.cd(lam); const bk = this.getPluralBinaKey(entry.bina);
    const defaultMufrod = `مِ${cFa}ْ${cAin}َ${cLam}ٌ`;
    const patterns = (bk === "naqish" || bk.startsWith("lafif"))? ["مَفَاعِيلُ", "مَفَاعِلُ"] : ["مَفَاعِيلُ", "مَفَاعِلُ"];
    const muntahal = this.fmtList(patterns, cFa, cAin, cLam, this.replaceForIsimAlat.bind(this), bk);
    let contoh = "", ilalRule = "", explanation = "";
    if(bk === "sahih"){ contoh = "مِفْتَاح ← مَفَاتِيح"; ilalRule = "Tanpa i'lal"; explanation = "Bina Shohih: Muntahal مَفَاعِيل / مَفَاعِل"; }
    else if(bk === "ajwaf"){ contoh = "مِخْيَاط ← مَخَائِيط"; ilalRule = "Ain → hamzah"; explanation = "Bina Ajwaf: ain jadi hamzah"; }
    else if(bk === "mitsal"){ contoh = "مِوْزَان ← مَوَازِين"; ilalRule = "Waw tetap"; explanation = "Bina Mitsal: waw tetap"; }
    else if(bk === "naqish"){ contoh = "مِغْزَى ← مَغَازِيُّ / مَغَازٍ"; ilalRule = "Lam dibuang"; explanation = "Bina Naqis: Muntahal مَفَاعِيل / مَفَاعٍ"; }
    else if(bk === "mudaaf"){ contoh = "مِقَصّ ← مَقَاصّ"; ilalRule = "Idgham"; explanation = "Bina Mudho'af: Muntahal مَفَاعِل dengan idgham"; }
    else if(bk === "mahmuz"){ contoh = "مِئْزَر ← مَآزِر"; ilalRule = "Hamzah + alif = آ"; explanation = "Bina Mahmuz: alif maddah"; }
    else { contoh = "مِطْوَى ← مَطَاوِيُّ / مَطَاوٍ"; ilalRule = "Lam dibuang"; explanation = "Bina Lafif: seperti Naqis"; }
    const processWord = (word: string) => {
      if (!word || word === "—" || word === "-") return "—";
      return word.split("/").map(w => this.postProcessWord(w.trim(), entry.bina || "Shohih", fa, ain, lam)).join(" / ");
    };
    const finalMufrod = this.postProcessWord(defaultMufrod, entry.bina || "Shohih", fa, ain, lam);
    return { mufrod: finalMufrod, qillah:"—", katsroh:"—", muntahal: processWord(muntahal), explanation: `${explanation}\n• Kaidah: ${ilalRule}\n• Contoh: ${contoh}` };
  },

  subSifat(pattern: string, fa: string, ain: string, lam: string, bk: string): string {
    const cFa = fa, cAin = ain, cLam = lam;
    if (pattern === "أَفْعَلُ") { if (bk === "mudaaf") return `أَ${cFa}َ${cLam}ُّ`; if (bk === "ajwaf") return `أَ${cFa}َا${cLam}ُ`; if (bk === "naqish" || bk === "lafif") return `أَ${cFa}ْ${cAin}َى`; return `أَ${cFa}ْ${cAin}َ${cLam}ُ`; }
    if (pattern === "فَعْلَاءُ") { if (bk === "mudaaf") return `${cFa}َ${cAin}َّاءُ`; if (bk === "naqish" || bk === "lafif") return `${cFa}َ${cAin}ْوَاءُ`; return `${cFa}َ${cAin}ْ${cLam}َاءُ`; }
    if (pattern === "فَعْلَانُ") { if (bk === "naqish" || bk === "lafif") return `${cFa}َ${cAin}ْيَانُ`; return `${cFa}َ${cAin}ْ${cLam}َانُ`; }
    if (pattern === "فَعْلَى") { if (bk === "naqish" || bk === "lafif") return `${cFa}َ${cAin}ْيَى`; return `${cFa}َ${cAin}ْ${cLam}ى`; }
    if (pattern === "فَعِيلٌ") { if (bk === "mudaaf") return `${cFa}َ${cAin}ِ${cLam}ٌ`; if (bk === "ajwaf") return `${cFa}َيِّ${cLam}ٌ`; if (bk === "naqish" || bk === "lafif") return `${cFa}َ${cAin}ِىٌّ`; return `${cFa}َ${cAin}ِي${cLam}ٌ`; }
    if (pattern === "فَعِيلَةٌ") { if (bk === "ajwaf") return `${cFa}َيِّ${cLam}َةٌ`; if (bk === "naqish" || bk === "lafif") return `${cFa}َ${cAin}ِيَّةٌ`; return `${cFa}َ${cAin}ِي${cLam}َةٌ`; }
    if (pattern === "فَعَالٌ") { if (bk === "naqish" || bk === "lafif") return `${cFa}َ${cAin}َاٍ`; return `${cFa}َ${cAin}َا${cLam}ٌ`; }
    if (pattern === "فَعَالَةٌ") { if (bk === "naqish" || bk === "lafif") return `${cFa}َ${cAin}َاِيَةٌ`; return `${cFa}َ${cAin}َا${cLam}َةٌ`; }
    if (pattern === "فَعِلٌ") { if (bk === "naqish" || bk === "lafif") return `${cFa}َ${cAin}ٍ`; return `${cFa}َ${cAin}ِ${cLam}ٌ`; }
    if (pattern === "فَعِلَةٌ") { if (bk === "naqish" || bk === "lafif") return `${cFa}َ${cAin}ِيَةٌ`; return `${cFa}َ${cAin}ِ${cLam}َةٌ`; }
    if (pattern === "فَعَلٌ") return `${cFa}َ${cAin}َ${cLam}ٌ`; if (pattern === "فَعَلَةٌ") return `${cFa}َ${cAin}َ${cLam}َةٌ`;
    if (pattern === "فَعْلٌ") { if (bk === "mudaaf") return `${cFa}َ${cLam}ٌّ`; return `${cFa}َ${cAin}ْ${cLam}ٌ`; }
    if (pattern === "فَعْلَةٌ") { if (bk === "mudaaf") return `${cFa}َ${cLam}َّةٌ`; return `${cFa}َ${cAin}ْ${cLam}َةٌ`; }
    if (pattern === "فُعْلٌ") { if (bk === "mudaaf") return `${cFa}ُ${cLam}ٌّ`; return `${cFa}ُ${cAin}ْ${cLam}ٌ`; }
    if (pattern === "فُعَلَاءُ") { if (bk === "mudaaf") return `${cFa}ُ${cLam}َّاءُ`; return `${cFa}ُ${cAin}َ${cLam}َاءُ`; }
    if (pattern === "أَفْعِلَاءُ") { if (bk === "mudaaf") return `أَ${cFa}ِ${cLam}َّاءُ`; return `أَ${cFa}ْ${cAin}ِ${cLam}َاءُ`; }
    if (pattern === "أَفِعَّاءُ") return `أَ${cFa}ِ${cLam}َّاءُ`; if (pattern === "أَفْعِيَّاءُ") return `أَ${cFa}ْ${cAin}ِيَّاءُ`;
    if (pattern === "فِعَالٌ") return `${cFa}ِ${cAin}َا${cLam}ٌ`; if (pattern === "أَفْعَالٌ") return `أَ${cFa}ْ${cAin}َا${cLam}ٌ`;
    if (pattern === "فُعُلٌ") { if (bk === "mudaaf") return `${cFa}ُ${cLam}ٌّ`; return `${cFa}ُ${cAin}ُ${cLam}ٌ`; }
    if (pattern === "أَفَاعِيلُ") return `أَ${cFa}َا${cAin}ِي${cLam}ُ`; if (pattern === "فَعَائِلُ") return `${cFa}َ${cAin}َائِ${cLam}ُ`;
    if (pattern === "فَعَايَا") return `${cFa}َ${cAin}َايَا`; if (pattern === "فَعِلُونَ") return `${cFa}َ${cAin}ِ${cLam}ُونَ`;
    return this.replaceRoot(pattern, fa, ain, lam);
  },

  detectWazanSifat(rawSifat: string): string {
    const cs = this.cd(rawSifat);
    if (rawSifat.includes("أَفْعَل") || cs.startsWith("أ")) return "أَفْعَلُ";
    if (rawSifat.includes("فَعْلَان")) return "فَعْلَانُ";
    if (cs.length === 4 && cs[2] === "ا" &&!rawSifat.includes("فَاعِل")) return "فَعَالٌ";
    if (rawSifat.includes("فَعُول") && cs.length === 4) return "فَعُولٌ";
    if (rawSifat.includes("فَعِيل")) return "فَعِيلٌ";
    if (cs.length === 3 && rawSifat.includes("ِ") &&!rawSifat.includes("ّ")) return "فَعِلٌ";
    if (cs.length === 3 &&!rawSifat.includes("ِ") &&!rawSifat.includes("ُ") &&!rawSifat.includes("ْ")) return "فَعَلٌ";
    if (cs.length === 3 && rawSifat.includes("ْ")) return "فَعْلٌ";
    return "فَعِيلٌ";
  },

  analyzeSifatMusyabihatPlural(entry: DictionaryEntry): PluralSifatMusyabihat {
    const raw = entry.sifatMusyabihat || "";
    if (!raw || raw === "—") return {mufrodMudzakkar:"—",mufrodMuannas:"—",katsroh:"—",qillah:"—",muntahal:"—",wazanName:"—",isQiyasi:false,isSamai:false,reference:"—",explanation:"Tidak ada Sifat Musyabihat."};
    const { fa, ain, lam } = entry.root; const cFa = this.cd(fa), cAin = this.cd(ain), cLam = this.cd(lam); const bk = this.getPluralBinaKey(entry.bina || "");
    const wazan = this.detectWazanSifat(raw); let mudzakkar = "", muannas = "", katsroh = "", muntahal = "", explanation = ""; const isSamai = wazan === "فَعَلٌ" || wazan === "فَعْلٌ";

    switch (wazan) {
      case "أَفْعَلُ": mudzakkar = this.subSifat("أَفْعَلُ", cFa, cAin, cLam, bk); muannas = this.subSifat("فَعْلَاءُ", cFa, cAin, cLam, bk); katsroh = `${this.subSifat("فُعْلٌ", cFa, cAin, cLam, bk)} / ${this.subSifat("فُعْلَانُ", cFa, cAin, cLam, bk)}`; explanation = "Wazan أَفْعَلُ. Jamak: فُعْلٌ / فُعْلَانُ"; break;
      case "فَعْلَانُ": mudzakkar = this.subSifat("فَعْلَانُ", cFa, cAin, cLam, bk); muannas = this.subSifat("فَعْلَى", cFa, cAin, cLam, bk); katsroh = this.subSifat("فِعَالٌ", cFa, cAin, cLam, bk); muntahal = this.subSifat("فَعَالَى", cFa, cAin, cLam, bk); explanation = "Wazan فَعْلَانُ. Jamak: فِعَالٌ, Muntahal: فَعَالَى"; break;
      case "فَعَالٌ": mudzakkar = this.subSifat("فَعَالٌ", cFa, cAin, cLam, bk); muannas = this.subSifat("فَعَالَةٌ", cFa, cAin, cLam, bk); katsroh = `${this.subSifat("فُعْلٌ", cFa, cAin, cLam, bk)} / ${this.subSifat("فُعَلَاءُ", cFa, cAin, cLam, bk)} / ${this.subSifat("أَفْعَالٌ", cFa, cAin, cLam, bk)}`; muntahal = this.subSifat("أَفَاعِيلُ", cFa, cAin, cLam, bk); explanation = "Wazan فَعَالٌ. Jamak: فُعْلٌ / فُعَلَاءُ / أَفْعَالٌ"; break;
      case "فَعُولٌ": mudzakkar = this.subSifat("فَعُولٌ", cFa, cAin, cLam, bk); muannas = this.subSifat("فَعُولٌ", cFa, cAin, cLam, bk); katsroh = this.subSifat("فُعُلٌ", cFa, cAin, cLam, bk); explanation = "Wazan فَعُولٌ. Jamak: فُعُلٌ"; break;
      case "فَعِلٌ": mudzakkar = this.subSifat("فَعِلٌ", cFa, cAin, cLam, bk); muannas = this.subSifat("فَعِلَةٌ", cFa, cAin, cLam, bk); katsroh = `${this.subSifat("أَفْعَالٌ", cFa, cAin, cLam, bk)} / ${this.subSifat("فَعِلُونَ", cFa, cAin, cLam, bk)}`; explanation = "Wazan فَعِلٌ. Jamak: أَفْعَالٌ / فَعِلُونَ"; break;
      case "فَعَلٌ": mudzakkar = this.subSifat("فَعَلٌ", cFa, cAin, cLam, bk); muannas = this.subSifat("فَعَلَةٌ", cFa, cAin, cLam, bk); katsroh = this.subSifat("فِعَالٌ", cFa, cAin, cLam, bk); muntahal = this.subSifat("مَفَاعِلُ", cFa, cAin, cLam, bk); explanation = "Wazan فَعَلٌ. Jamak: فِعَالٌ"; break;
      case "فَعْلٌ": mudzakkar = this.subSifat("فَعْلٌ", cFa, cAin, cLam, bk); muannas = this.subSifat("فَعْلَةٌ", cFa, cAin, cLam, bk); katsroh = `${this.subSifat("فِعَالٌ", cFa, cAin, cLam, bk)} / ${this.subSifat("فُعُولٌ", cFa, cAin, cLam, bk)}`; explanation = "Wazan فَعْلٌ. Jamak: فِعَالٌ / فُعُولٌ"; break;
      default: mudzakkar = this.subSifat("فَعِيلٌ", cFa, cAin, cLam, bk); muannas = this.subSifat("فَعِيلَةٌ", cFa, cAin, cLam, bk); katsroh = `${this.subSifat("فُعَلَاءُ", cFa, cAin, cLam, bk)} / ${this.subSifat("فِعَالٌ", cFa, cAin, cLam, bk)} / ${this.subSifat("أَفْعِلَاءُ", cFa, cAin, cLam, bk)}`; muntahal = this.subSifat("فَعَائِلُ", cFa, cAin, cLam, bk); explanation = "Wazan فَعِيلٌ. Jamak: فُعَلَاءُ / فِعَالٌ / أَفْعِلَاءُ"; break;
    }
    const processWord = (word: string) => {
      if (!word || word === "—") return "—";
      return word.split("/").map(w => this.postProcessWord(w.trim(), entry.bina || "Shohih", fa, ain, lam)).join(" / ");
    };

    const finalMudzakkar = processWord(mudzakkar);
    const finalMuannas = processWord(muannas);
    const finalKatsroh = processWord(katsroh);
    const finalMuntahal = processWord(muntahal);

    return {mufrodMudzakkar: finalMudzakkar, mufrodMuannas: finalMuannas, katsroh: finalKatsroh, qillah:"—", muntahal: finalMuntahal, wazanName:wazan, isQiyasi:!isSamai, isSamai, reference:"Lisanul 'Arab", explanation};
  },

  // ===== FUNGSI GABUNGAN UTAMA =====
  tasrifLengkap(dataWazan: DataWazan, sifatMusyabihat?: string) {
    const { fa, ain, lam, babNum = 1 } = dataWazan; const bina = this.detectBina(fa, ain, lam);
    const istilahi = this.tasrifIstilahiCustom(dataWazan);
    const lughowi = this.tasrifLughowi(istilahi, fa, ain, lam, bina, babNum);

    // Automatically generate default Sifat Musyabihat if empty and bab is 4 or 5
    let finalSifat = sifatMusyabihat || "—";
    if (finalSifat === "—" || finalSifat === "-") {
      if (babNum === 5 || babNum === 4) {
        finalSifat = this.buatIsimMusyabihat(fa, ain, lam);
      }
    }

    const entry: DictionaryEntry = { root: {fa, ain, lam}, bina, sifatMusyabihat: finalSifat, babNum };
    const jamak = { fail: this.analyzeIsimFailPlural(entry), maful: this.analyzeIsimMafulPlural(entry), zaman: this.analyzeIsimZamanMakanPlural(entry), alat: this.analyzeIsimAlatPlural(entry) };
    const sifat = this.analyzeSifatMusyabihatPlural(entry);
    return { istilahi, lughowi, jamak, sifat };
  }
}
