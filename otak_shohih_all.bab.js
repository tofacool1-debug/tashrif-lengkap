class OtakShohihAllBab {
  constructor(asal = 'ن ص ر', bab = 1) {
    this.asal = asal;
    [this.f, this.ain, this.lam] = asal.split(' ');
    this.bab = bab;
    this.setting = {
      1: {madhi:'َ', mudhari:'ُ', wazanMadhi:'فَعَلَ', wazanMudhari:'يَفْعُلُ'}, // نَصَرَ يَنْصُرُ
      2: {madhi:'َ', mudhari:'ِ', wazanMadhi:'فَعَلَ', wazanMudhari:'يَفْعِلُ'}, // ضَرَبَ يَضْرِبُ
      3: {madhi:'َ', mudhari:'َ', wazanMadhi:'فَعَلَ', wazanMudhari:'يَفْعَلُ'}, // فَتَحَ يَفْتَحُ
      4: {madhi:'ِ', mudhari:'َ', wazanMadhi:'فَعِلَ', wazanMudhari:'يَفْعَلُ'}, // عَلِمَ يَعْلَمُ
      5: {madhi:'ُ', mudhari:'ُ', wazanMadhi:'فَعُلَ', wazanMudhari:'يَفْعُلُ'}, // كَرُمَ يَكْرُمُ
      6: {madhi:'ِ', mudhari:'ِ', wazanMadhi:'فَعِلَ', wazanMudhari:'يَفْعِلُ'} // حَسِبَ يَحْسِبُ
    }[bab];
  }

  tasrif() {
    const h1 = this.setting.madhi;
    const h2 = this.setting.mudhari;

    return {
      asal: this.asal,
      bina: 'Shohih',
      bab: this.bab,
      wazan: `${this.setting.wazanMadhi} ${this.setting.wazanMudhari}`,
      keterangan: this.getKeteranganBab(),

      istilah: this.getIstilah12(h1, h2),
      lughowi: this.getSemuaLughowi(h1, h2),
      masdar: {
        masdar23: this.getMasdar23(h1),
        marrah: this.getMarrah(h1),
        nau: this.getNau(h1)
      },
      sifatMusyabihat: this.getSifatMusyabihat(h1),
      jamak: this.getSemuaJamak(h1),
      isimTafdhil: this.getIsimTafdhil()
    };
  }

  getKeteranganBab() {
    const ket = {
      1: 'فَعَلَ يَفْعُلُ - نَصَرَ يَنْصُرُ',
      2: 'فَعَلَ يَفْعِلُ - ضَرَبَ يَضْرِبُ',
      3: 'فَعَلَ يَفْعَلُ - فَتَحَ يَفْتَحُ',
      4: 'فَعِلَ يَفْعَلُ - عَلِمَ يَعْلَمُ',
      5: 'فَعُلَ يَفْعُلُ - كَرُمَ يَكْرُمُ',
      6: 'فَعِلَ يَفْعِلُ - حَسِبَ يَحْسِبُ'
    };
    return ket[this.bab];
  }

  getIstilah12(h1, h2) {
    return [
      {no:1, nama:'الماضي', fiil: `${this.f}${h1}${this.ain}${h1}${this.lam}${h1}`, wazan:this.setting.wazanMadhi},
      {no:2, nama:'المضارع', fiil: `يَ${this.f}${h1}${this.ain}${h2}${this.lam}${h2}`, wazan:this.setting.wazanMudhari},
      {no:3, nama:'الأمر', fiil: `اِ${this.f}${h1}${this.ain}ْ${this.lam}${h2}`, wazan:'اِفْعُلْ/اِفْعِلْ'},
      {no:4, nama:'النهي', fiil: `لَا تَ${this.f}${h1}${this.ain}ْ${this.lam}`, wazan:'لَا تَفْعُلْ'},
      {no:5, nama:'المصدر', fiil: `${this.f}${h1}${this.ain}ْ${this.lam}ًا`, wazan:'فَعْلًا'},
      {no:6, nama:'اسم الفاعل', fiil: `${this.f}َ${this.ain}ِ${this.lam}ٌ`, wazan:'فَاعِلٌ'},
      {no:7, nama:'اسم المفعول', fiil: `مَ${this.f}ْ${this.ain}ُ${this.lam}ٌ`, wazan:'مَفْعُوْلٌ'},
      {no:8, nama:'اسم التفضيل', fiil: `أَ${this.f}ْ${this.ain}${this.lam}ُ`, wazan:'أَفْعَلُ'},
      {no:9, nama:'اسم الزمان', fiil: `مَ${this.f}${h1}${this.lam}ٌ`, wazan:'مَفْعَلٌ'},
      {no:10, nama:'اسم المكان', fiil: `مَ${this.f}${h1}${this.lam}ٌ`, wazan:'مَفْعَلٌ'},
      {no:11, nama:'اسم الآلة', fiil: `مِ${this.f}${h1}${this.lam}`, wazan:'مِفْعَلٌ'},
      {no:12, nama:'اسم التصغير', fiil: `${this.f}ُ${this.ain}َيْ${this.lam}`, wazan:'فُعَيْلٌ'}
    ];
  }

  getSemuaLughowi(h1, h2) {
    return {
      madhi: this.getLughowiMadhi14(h1),
      mudhari: this.getLughowiMudhari14(h1, h2),
      amar: this.getLughowiAmar14(h1, h2),
      nahi: this.getLughowiNahi14(h1),
      isimFail: this.getLughowiIsimFail6(),
      isimMaful: this.getLughowiIsimMaful6(),
      isimZaman: this.getLughowiIsimZaman6(h1),
      isimMakan: this.getLughowiIsimMakan6(h1),
      isimAlat: this.getLughowiIsimAlat14(h1)
    };
  }

  getLughowiMadhi14(h1) {
    const pola = [
      ['هو', `${this.f}${h1}${this.ain}${h1}${this.lam}${h1}`],
      ['هي', `${this.f}${h1}${this.ain}${h1}${this.lam}َتْ`],
      ['أنتَ', `${this.f}${h1}${this.ain}${h1}${this.lam}ْتَ`],
      ['أنتِ', `${this.f}${h1}${this.ain}${h1}${this.lam}ْتِ`],
      ['أنا', `${this.f}${h1}${this.ain}${h1}${this.lam}ْتُ`],
      ['نحن', `${this.f}${h1}${this.ain}${h1}${this.lam}ْنَا`],
      ['هما', `${this.f}${h1}${this.ain}${h1}${this.lam}َا`],
      ['هم', `${this.f}${h1}${this.ain}${h1}${this.lam}ُوْا`],
      ['هن', `${this.f}${h1}${this.ain}${h1}${this.lam}ْـنَ`],
      ['أنتما', `${this.f}${h1}${this.ain}${h1}${this.lam}ْتُمَا`],
      ['أنتم', `${this.f}${h1}${this.ain}${h1}${this.lam}ْتُمْ`],
      ['أنتن', `${this.f}${h1}${this.ain}${h1}${this.lam}ْتُنَّ`],
      ['هما مؤنث', `${this.f}${h1}${this.ain}${h1}${this.lam}َتَا`],
      ['نحن متكلم', `${this.f}${h1}${this.ain}${h1}${this.lam}ْنَا`]
    ];
    return pola.map((p,i) => ({no:i+1, dhamir:p[0], fiil:p[1]}));
  }

  getLughowiMudhari14(h1, h2) {
    const pola = [
      ['هو', `يَ${this.f}${h1}${this.ain}${h2}${this.lam}${h2}`],
      ['هي', `تَ${this.f}${h1}${this.ain}${h2}${this.lam}${h2}`],
      ['أنتَ', `تَ${this.f}${h1}${this.ain}${h2}${this.lam}${h2}`],
      ['أنتِ', `تَ${this.f}${h1}${this.ain}${h2}${this.lam}ِيْنَ`],
      ['أنا', `أَ${this.f}${h1}${this.ain}${h2}${this.lam}${h2}`],
      ['نحن', `نَ${this.f}${h1}${this.ain}${h2}${this.lam}${h2}`],
      ['هما', `يَ${this.f}${h1}${this.ain}${h2}${this.lam}َانِ`],
      ['هم', `يَ${this.f}${h1}${this.ain}${h2}${this.lam}ُوْنَ`],
      ['هن', `يَ${this.f}${h1}${this.ain}${h2}${this.lam}ْـنَ`],
      ['أنتما', `تَ${this.f}${h1}${this.ain}${h2}${this.lam}َانِ`],
      ['أنتم', `تَ${this.f}${h1}${this.ain}${h2}${this.lam}ُوْنَ`],
      ['أنتن', `تَ${this.f}${h1}${this.ain}${h2}${this.lam}ْـنَ`],
      ['هما مؤنث', `تَ${this.f}${h1}${this.ain}${h2}${this.lam}َانِ`],
      ['أنا متكلم', `أَ${this.f}${h1}${this.ain}${h2}${this.lam}${h2}`]
    ];
    return pola.map((p,i) => ({no:i+1, dhamir:p[0], fiil:p[1]}));
  }

  getLughowiAmar14(h1, h2) {
    const pola = [
      ['أنتَ', `اِ${this.f}${h1}${this.ain}ْ${this.lam}${h2}`],
      ['أنتِ', `اِ${this.f}${h1}${this.ain}ْ${this.lam}ِي`],
      ['أنتما', `اِ${this.f}${h1}${this.ain}ْ${this.lam}َا`],
      ['أنتم', `اُ${this.f}${h1}${this.ain}ْ${this.lam}ُوْا`],
      ['أنتن', `اُ${this.f}${h1}${this.ain}ْ${this.lam}ْـنَ`]
    ];
    const lengkap = Array(14).fill(['-', '-']);
    pola.forEach((p,i) => lengkap[i] = p);
    return lengkap.map((p,i) => ({no:i+1, dhamir:p[0], fiil:p[1]}));
  }

  getLughowiNahi14(h1) {
    const pola = [
      ['أنتَ', `لَا تَ${this.f}${h1}${this.ain}ْ${this.lam}`],
      ['أنتِ', `لَا تَ${this.f}${h1}${this.ain}ْ${this.lam}ِي`],
      ['أنتما', `لَا تَ${this.f}${h1}${this.ain}ْ${this.lam}َا`],
      ['أنتم', `لَا تَ${this.f}${h1}${this.ain}ْ${this.lam}ُوْا`],
      ['أنتن', `لَا تَ${this.f}${h1}${this.ain}ْ${this.lam}ْـنَ`]
    ];
    const lengkap = Array(14).fill(['-', '-']);
    pola.forEach((p,i) => lengkap[i] = p);
    return lengkap.map((p,i) => ({no:i+1, dhamir:p[0], fiil:p[1]}));
  }

  getLughowiIsimFail6() {
    const dasar = `${this.f}َ${this.ain}ِ${this.lam}`;
    return [
      {no:1, bentuk:'مفرد مذكر', fiil: `${dasar}ٌ`},
      {no:2, bentuk:'مفرد مؤنث', fiil: `${dasar}َةٌ`},
      {no:3, bentuk:'تثنية مذكر', fiil: `${dasar}َانِ`},
      {no:4, bentuk:'تثنية مؤنث', fiil: `${dasar}َتَانِ`},
      {no:5, bentuk:'جمع مذكر', fiil: `${dasar}ُوْنَ`},
      {no:6, bentuk:'جمع مؤنث', fiil: `${dasar}َاتٌ`}
    ];
  }

  getLughowiIsimMaful6() {
    const dasar = `مَ${this.f}ْ${this.ain}ُ${this.lam}`;
    return [
      {no:1, bentuk:'مفرد مذكر', fiil: `${dasar}ٌ`},
      {no:2, bentuk:'مفرد مؤنث', fiil: `${dasar}َةٌ`},
      {no:3, bentuk:'تثنية مذكر', fiil: `${dasar}َانِ`},
      {no:4, bentuk:'تثنية مؤنث', fiil: `${dasar}َتَانِ`},
      {no:5, bentuk:'جمع مذكر', fiil: `${dasar}ُوْنَ`},
      {no:6, bentuk:'جمع مؤنث', fiil: `${dasar}َاتٌ`}
    ];
  }

  getLughowiIsimZaman6(h1) {
    const dasar = `مَ${this.f}${h1}${this.lam}`;
    return [
      {no:1, bentuk:'مفرد مذكر', fiil: `${dasar}ٌ`},
      {no:2, bentuk:'مفرد مؤنث', fiil: `${dasar}َةٌ`},
      {no:3, bentuk:'تثنية مذكر', fiil: `${dasar}َانِ`},
      {no:4, bentuk:'تثنية مؤنث', fiil: `${dasar}َتَانِ`},
      {no:5, bentuk:'جمع مذكر', fiil: `${dasar}ُوْنَ`},
      {no:6, bentuk:'جمع مؤنث', fiil: `${dasar}َاتٌ`}
    ];
  }

  getLughowiIsimMakan6(h1) {
    return this.getLughowiIsimZaman6(h1);
  }

  getLughowiIsimAlat14(h1) {
    const dasar = `مِ${this.f}${h1}${this.lam}`;
    const pola = [
      ['هو', dasar], ['هي', `${dasar}َة`], ['هما مذكر', `${dasar}َانِ`],
      ['هما مؤنث', `${dasar}َتَانِ`], ['هم', `${this.f}َ${this.ain}ِ${this.lam}َاتٌ`],
      ['هن', `${dasar}َاتٌ`], ['أنتَ', dasar], ['أنتِ', `${dasar}َة`],
      ['أنتما', `${dasar}َانِ`], ['أنتم', `${this.f}َ${this.ain}ِ${this.lam}َاتٌ`],
      ['أنتن', `${dasar}َاتٌ`], ['أنا', dasar], ['نحن تثنية', `${dasar}َانِ`],
      ['نحن جمع', `${this.f}َ${this.ain}ِ${this.lam}َاتٌ`]
    ];
    return pola.map((p,i) => ({no:i+1, dhamir:p[0], fiil:p[1]}));
  }

  getSifatMusyabihat(h1) {
    return [
      {wazan:'فَعِل', fiil: `${this.f}${h1}${this.ain}ِ${this.lam}`, arti:'Yang...', contoh:'نَصِر'},
      {wazan:'فَعُول', fiil: `${this.f}${h1}${this.ain}ُ${this.lam}`, arti:'Yang sangat...', contoh:'نَصُوْر'},
      {wazan:'فَعِيل', fiil: `${this.f}${h1}${this.ain}ِي${this.lam}`, arti:'Yang sangat...', contoh:'نَصِيْر'},
      {wazan:'فَعَل', fiil: `${this.f}${h1}${this.ain}${h1}${this.lam}`, arti:'Yang...', contoh:'نَصَر'}
    ];
  }

  getSemuaJamak(h1) {
    return {
      // 1. DARI FI'IL
      dariFiil: {
        taksir: [
          {wazan:'فُعُول', fiil: `${this.f}ُ${this.ain}ُ${this.lam}`, contoh:'نُصُوْر'},
          {wazan:'فِعَال', fiil: `${this.f}ِ${this.ain}َ${this.lam}`, contoh:'نِصَال'}
        ],
        muntahal: [
          {wazan:'مَفَاعِل', fiil: `مَ${this.f}َ${this.ain}ِ${this.lam}`, contoh:'مَنَاصِر'}
        ]
      },

      // 2. DARI ISIM FAIL
      dariIsimFail: {
        taksir: [
          {wazan:'فُعَّال', fiil: `${this.f}ُ${this.ain}َّ${this.lam}`, contoh:'نُصَّر'},
          {wazan:'فَعَلَة', fiil: `${this.f}َ${this.ain}َلَة`, contoh:'نَصَرَة'}
        ],
        muntahal: [
          {wazan:'فَعَائِل', fiil: `${this.f}َ${this.ain}ِ${this.lam}َائِل`, contoh:'نَصَائِر'}
        ]
      },

      // 3. DARI ISIM MAF'UL
      dariIsimMaful: {
        taksir: [
          {wazan:'مَفَاعِيل', fiil: `مَ${this.f}َ${this.ain}َاوِي${this.lam}`, contoh:'مَنَاصِيْر'}
        ],
        muntahal: [
          {wazan:'مَفَاعِيل', fiil: `مَ${this.f}َ${this.ain}َاوِي${this.lam}`, contoh:'مَنَاصِيْر'}
        ]
      },

      // 4. DARI ISIM ZAMAN
      dariIsimZaman: {
        taksir: [
          {wazan:'مَفَاعِل', fiil: `مَ${this.f}َ${this.ain}ِ${this.lam}`, contoh:'مَنَاصِر'}
        ],
        muntahal: [
          {wazan:'مَفَاعِل', fiil: `مَ${this.f}َ${this.ain}ِ${this.lam}`, contoh:'مَنَاصِر'}
        ]
      },

      // 5. DARI ISIM MAKAN
      dariIsimMakan: {
        taksir: [
          {wazan:'مَفَاعِل', fiil: `مَ${this.f}َ${this.ain}ِ${this.lam}`, contoh:'مَنَاصِر'}
        ],
        muntahal: [
          {wazan:'مَفَاعِل', fiil: `مَ${this.f}َ${this.ain}ِ${this.lam}`, contoh:'مَنَاصِر'}
        ]
      },

      // 6. DARI ISIM ALAT
      dariIsimAlat: {
        taksir: [
          {wazan:'مَفَاعِيل', fiil: `مَ${this.f}َ${this.ain}َاوِ${this.lam}`, contoh:'مَنَاصِيْر'},
          {wazan:'مَفَاعِل', fiil: `مَ${this.f}َ${this.ain}ِ${this.lam}`, contoh:'مَنَاصِر'}
        ],
        muntahal: [
          {wazan:'مَفَاعِيل', fiil: `مَ${this.f}َ${this.ain}َاوِ${this.lam}`, contoh:'مَنَاصِيْر'},
          {wazan:'مَفَاعِل', fiil: `مَ${this.f}َ${this.ain}ِ${this.lam}`, contoh:'مَنَاصِر'}
        ]
      }
    };
  }

  getMasdar23(h1) {
    const wazan = [
      `${this.f}${h1}${this.ain}ْ${this.lam}ًا`, `${this.f}ِ${this.ain}َ${this.lam}ًا`,
      `تَ${this.f}ْ${this.ain}ِي${this.lam}ًا`, `اِ${this.f}ْ${this.ain}َ${this.lam}ًا`,
      `${this.f}${h1}${this.ain}ْ${this.lam}َة`, `${this.f}${h1}${this.ain}ِ${this.lam}َة`
    ];
    return wazan.map((m,i) => ({no:i+1, masdar:m}));
  }

  getMarrah(h1) {
    return [
      {wazan:'فَعْلَة', fiil: `${this.f}${h1}${this.ain}ْ${this.lam}َة`, contoh:'نَصْرَة'}
    ];
  }

  getNau(h1) {
    return [
      {wazan:'فِعْلَة', fiil: `${this.f}ِ${this.ain}ْ${this.lam}َة`, contoh:'نِصْرَة'}
    ];
  }

  getIsimTafdhil() {
    return {
      mudzakkar: `أَ${this.f}ْ${this.ain}${this.lam}ُ`,
      muannats: `${this.f}ُ${this.ain}ْ${this.lam}َى`,
      jamak: `أَفَ${this.f}ِ${this.lam}ُ`
    };
  }
}

// TEST CONTOH ن ص ر BAB 1
const otak = new OtakShohihAllBab('ن ص ر', 1);
const hasil = otak.tasrif();

console.log(hasil.wazan); // فَعَلَ يَفْعُلُ
console.log(hasil.istilah[1]); // المضارع: يَنْصُرُ
console.log(hasil.lughowi.madhi[0]); // هو: نَصَرَ
console.log(hasil.lughowi.mudhari[7]); // هم: يَنْصُرُوْنَ
console.log(hasil.jamak.dariIsimFail.taksir[0]); // فُعَّال: نُصَّر
console.log(hasil.sifatMusyabihat[1]); // فَعُول: نَصُوْر