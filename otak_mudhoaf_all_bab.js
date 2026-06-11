class OtakMudhoafAllBab {
  constructor(asal = 'م د', bab = 1) {
    this.asal = asal;
    [this.f, this.ain, this.lam] = asal.split(' ');
    this.bab = bab;

    // SETTING HAROKAT PER BAB
    const settingBab = {
      1: {madhi:'َ', mudhari:'ُ', wazanMadhi:'فَعَلَ', wazanMudhari:'يَفْعُلُ'}, // مَدَّ يَمُدُّ
      2: {madhi:'َ', mudhari:'ِ', wazanMadhi:'فَعَلَ', wazanMudhari:'يَفْعِلُ'}, // حَبَّ يَحِبُّ
      3: {madhi:'َ', mudhari:'َ', wazanMadhi:'فَعَلَ', wazanMudhari:'يَفْعَلُ'}, // فَرَّ يَفِرُّ
      4: {madhi:'ِ', mudhari:'َ', wazanMadhi:'فَعِلَ', wazanMudhari:'يَفْعَلُ'}, // مَرَّ يَمَرُّ
      5: {madhi:'ُ', mudhari:'ُ', wazanMadhi:'فَعُلَ', wazanMudhari:'يَفْعُلُ'}, // جَلَّ يَجُلُّ
      6: {madhi:'ِ', mudhari:'ِ', wazanMadhi:'فَعِلَ', wazanMudhari:'يَفْعِلُ'} // حَسِبَ يَحْسِبُ
    };

    this.setting = settingBab[bab];
    if(!this.setting) throw new Error('Bab harus 1-6');
  }

  idghom(fiil) {
    return fiil.replace(`${this.ain}${this.lam}`, `${this.ain}ّ${this.lam}`);
  }
  fakk(fiil) {
    return fiil.replace(`${this.ain}ّ`, `${this.ain}${this.lam}`);
  }

  tasrif() {
    return {
      asal: this.asal,
      bina: 'Mudho\'af',
      bab: this.bab,
      wazan: `${this.setting.wazanMadhi} ${this.setting.wazanMudhari}`,
      keterangan: this.getKeteranganBab(),

      istilah: this.getIstilah12(),
      lughowi: this.getSemuaLughowi(),
      masdar: {
        masdar23: this.getMasdar23(),
        marrah: this.getMarrah(),
        nau: this.getNau()
      },
      sifatMusyabihat: this.getSifatMusyabihat(),
      jamak: this.getSemuaJamak(),
      isimTafdhil: this.getIsimTafdhil()
    };
  }

  getKeteranganBab() {
    const ket = {
      1: 'فَعَلَ يَفْعُلُ - فَتْحَة + ضَمَّة',
      2: 'فَعَلَ يَفْعِلُ - فَتْحَة + كَسْرَة',
      3: 'فَعَلَ يَفْعَلُ - فَتْحَة + فَتْحَة',
      4: 'فَعِلَ يَفْعَلُ - كَسْرَة + فَتْحَة',
      5: 'فَعُلَ يَفْعُلُ - ضَمَّة + ضَمَّة',
      6: 'فَعِلَ يَفْعِلُ - كَسْرَة + كَسْرَة'
    };
    return ket[this.bab];
  }

  getIstilah12() {
    const madhi = this.idghom(`${this.f}${this.setting.madhi}${this.ain}${this.lam}${this.setting.madhi}`);
    const mudhari = this.idghom(`يَ${this.f}ْ${this.ain}${this.lam}${this.setting.mudhari}`);
    const amar = this.idghom(`اُ${this.f}ْ${this.ain}${this.lam}${this.setting.mudhari}`);

    return [
      {no:1, nama:'الماضي', fiil: madhi, wazan:this.setting.wazanMadhi},
      {no:2, nama:'المضارع', fiil: mudhari, wazan:this.setting.wazanMudhari},
      {no:3, nama:'الأمر', fiil: amar, wazan:'اُفْعُلْ/اُفْعِلْ/اُفْعَلْ'},
      {no:4, nama:'النهي', fiil: this.fakk(`لَا تَ${this.f}ْ${this.ain}${this.lam}`), wazan:'لَا تَفْعُلْ'},
      {no:5, nama:'المصدر', fiil: `${this.f}${this.setting.madhi}${this.ain}ًّا`, wazan:'فَعْلًا'},
      {no:6, nama:'اسم الفاعل', fiil: this.idghom(`${this.f}${this.setting.madhi}${this.ain}${this.lam}ٌ`), wazan:'فَاعِلٌ'},
      {no:7, nama:'اسم المفعول', fiil: `مَ${this.f}ْ${this.ain}ُوْدٌ`, wazan:'مَفْعُوْلٌ'},
      {no:8, nama:'اسم التفضيل', fiil: `أَ${this.f}ّ${this.lam}ُ`, wazan:'أَفْعَلُ'},
      {no:9, nama:'اسم الزمان', fiil: `مَ${this.f}ٌّ`, wazan:'مَفْعَلٌ'},
      {no:10, nama:'اسم المكان', fiil: `مَ${this.f}ٌّ`, wazan:'مَفْعَلٌ'},
      {no:11, nama:'اسم الآلة', fiil: `مِ${this.f}ّ${this.lam}`, wazan:'مِفْعَلٌ'},
      {no:12, nama:'اسم التصغير', fiil: `${this.f}ُ${this.ain}َيْ${this.lam}`, wazan:'فُعَيْلٌ'}
    ];
  }

  getSemuaLughowi() {
    return {
      madhi: this.getLughowiMadhi14(),
      mudhari: this.getLughowiMudhari14(),
      amar: this.getLughowiAmar14(),
      nahi: this.getLughowiNahi14(),
      isimFail: this.getLughowiIsimFail6(),
      isimMaful: this.getLughowiIsimMaful6(),
      isimZaman: this.getLughowiIsimZaman6(),
      isimMakan: this.getLughowiIsimMakan6(),
      isimAlat: this.getLughowiIsimAlat14()
    };
  }

  getLughowiMadhi14() {
    const h = this.setting.madhi;
    const pola = [
      ['هو', this.idghom(`${this.f}${h}${this.ain}${this.lam}${h}`)],
      ['هي', this.fakk(`${this.f}${h}${this.ain}${this.lam}َتْ`)],
      ['أنتَ', this.fakk(`${this.f}${h}${this.ain}${this.lam}ْتَ`)],
      ['أنتِ', this.fakk(`${this.f}${h}${this.ain}${this.lam}ْتِ`)],
      ['أنا', this.fakk(`${this.f}${h}${this.ain}${this.lam}ْتُ`)],
      ['نحن', this.fakk(`${this.f}${h}${this.ain}${this.lam}ْنَا`)],
      ['هما', this.idghom(`${this.f}${h}${this.ain}${this.lam}َا`)],
      ['هم', this.idghom(`${this.f}${h}${this.ain}${this.lam}ُوْا`)],
      ['هن', this.fakk(`${this.f}${h}${this.ain}${this.lam}ْـنَ`)],
      ['أنتما', this.fakk(`${this.f}${h}${this.ain}${this.lam}ْتُمَا`)],
      ['أنتم', this.fakk(`${this.f}${h}${this.ain}${this.lam}ْتُمْ`)],
      ['أنتن', this.fakk(`${this.f}${h}${this.ain}${this.lam}ْتُنَّ`)],
      ['هما مؤنث', this.fakk(`${this.f}${h}${this.ain}${this.lam}َتَا`)],
      ['نحن متكلم', this.fakk(`${this.f}${h}${this.ain}${this.lam}ْنَا`)]
    ];
    return pola.map((p,i) => ({no:i+1, dhamir:p[0], fiil:p[1]}));
  }

  getLughowiMudhari14() {
    const h = this.setting.mudhari;
    const pola = [
      ['هو', this.idghom(`يَ${this.f}ْ${this.ain}${this.lam}${h}`)],
      ['هي', this.idghom(`تَ${this.f}ْ${this.ain}${this.lam}${h}`)],
      ['أنتَ', this.idghom(`تَ${this.f}ْ${this.ain}${this.lam}${h}`)],
      ['أنتِ', this.fakk(`تَ${this.f}ْ${this.ain}${this.lam}ِيْنَ`)],
      ['أنا', this.idghom(`أَ${this.f}ْ${this.ain}${this.lam}${h}`)],
      ['نحن', this.idghom(`نَ${this.f}ْ${this.ain}${this.lam}${h}`)],
      ['هما', this.idghom(`يَ${this.f}ْ${this.ain}${this.lam}َانِ`)],
      ['هم', this.fakk(`يَ${this.f}ْ${this.ain}${this.lam}ُوْنَ`)],
      ['هن', this.fakk(`يَ${this.f}ْ${this.ain}${this.lam}ْـنَ`)],
      ['أنتما', this.idghom(`تَ${this.f}ْ${this.ain}${this.lam}َانِ`)],
      ['أنتم', this.fakk(`تَ${this.f}ْ${this.ain}${this.lam}ُوْنَ`)],
      ['أنتن', this.fakk(`تَ${this.f}ْ${this.ain}${this.lam}ْـنَ`)],
      ['هما مؤنث', this.idghom(`تَ${this.f}ْ${this.ain}${this.lam}َانِ`)],
      ['أنا متكلم', this.idghom(`أَ${this.f}ْ${this.ain}${this.lam}${h}`)]
    ];
    return pola.map((p,i) => ({no:i+1, dhamir:p[0], fiil:p[1]}));
  }

  getLughowiAmar14() {
    const h = this.setting.mudhari;
    const pola = [
      ['أنتَ', this.idghom(`اُ${this.f}ْ${this.ain}${this.lam}${h}`)],
      ['أنتِ', this.fakk(`اِ${this.f}ْ${this.ain}${this.lam}ِي`)],
      ['أنتما', this.idghom(`اِ${this.f}ْ${this.ain}${this.lam}َا`)],
      ['أنتم', this.fakk(`اُ${this.f}ْ${this.ain}${this.lam}ُوْا`)],
      ['أنتن', this.fakk(`اُ${this.f}ْ${this.ain}${this.lam}ْـنَ`)]
    ];
    const lengkap = Array(14).fill(['-', '-']);
    pola.forEach((p,i) => lengkap[i] = p);
    return lengkap.map((p,i) => ({no:i+1, dhamir:p[0], fiil:p[1]}));
  }

  getLughowiNahi14() {
    const pola = [
      ['أنتَ', this.fakk(`لَا تَ${this.f}ْ${this.ain}${this.lam}`)],
      ['أنتِ', this.fakk(`لَا تَ${this.f}ْ${this.ain}${this.lam}ِي`)],
      ['أنتما', this.fakk(`لَا تَ${this.f}ْ${this.ain}${this.lam}َا`)],
      ['أنتم', this.fakk(`لَا تَ${this.f}ْ${this.ain}${this.lam}ُوْا`)],
      ['أنتن', this.fakk(`لَا تَ${this.f}ْ${this.ain}${this.lam}ْـنَ`)]
    ];
    const lengkap = Array(14).fill(['-', '-']);
    pola.forEach((p,i) => lengkap[i] = p);
    return lengkap.map((p,i) => ({no:i+1, dhamir:p[0], fiil:p[1]}));
  }

  getLughowiIsimFail6() {
    const dasar = this.idghom(`${this.f}${this.setting.madhi}${this.ain}${this.lam}`);
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
    const dasar = `مَ${this.f}ْ${this.ain}ُوْد`;
    return [
      {no:1, bentuk:'مفرد مذكر', fiil: `${dasar}ٌ`},
      {no:2, bentuk:'مفرد مؤنث', fiil: `${dasar}َةٌ`},
      {no:3, bentuk:'تثنية مذكر', fiil: `${dasar}َانِ`},
      {no:4, bentuk:'تثنية مؤنث', fiil: `${dasar}َتَانِ`},
      {no:5, bentuk:'جمع مذكر', fiil: `${dasar}ُوْنَ`},
      {no:6, bentuk:'جمع مؤنث', fiil: `${dasar}َاتٌ`}
    ];
  }

  getLughowiIsimZaman6() {
    const dasar = `مَ${this.f}ّ`;
    return [
      {no:1, bentuk:'مفرد مذكر', fiil: `${dasar}ٌ`},
      {no:2, bentuk:'مفرد مؤنث', fiil: `${dasar}َةٌ`},
      {no:3, bentuk:'تثنية مذكر', fiil: `${dasar}َانِ`},
      {no:4, bentuk:'تثنية مؤنث', fiil: `${dasar}َتَانِ`},
      {no:5, bentuk:'جمع مذكر', fiil: `${dasar}ُوْنَ`},
      {no:6, bentuk:'جمع مؤنث', fiil: `${dasar}َاتٌ`}
    ];
  }

  getLughowiIsimMakan6() {
    return this.getLughowiIsimZaman6();
  }

  getLughowiIsimAlat14() {
    const dasar = `مِ${this.f}ّ${this.lam}`;
    const pola = [
      ['هو', dasar], ['هي', `${dasar}َة`], ['هما مذكر', `${dasar}َانِ`],
      ['هما مؤنث', `${dasar}َتَانِ`], ['هم', `${this.f}َ${this.ain}َادٌ`],
      ['هن', `${dasar}َاتٌ`], ['أنتَ', dasar], ['أنتِ', `${dasar}َة`],
      ['أنتما', `${dasar}َانِ`], ['أنتم', `${this.f}َ${this.ain}َادٌ`],
      ['أنتن', `${dasar}َاتٌ`], ['أنا', dasar], ['نحن تثنية', `${dasar}َانِ`],
      ['نحن جمع', `${this.f}َ${this.ain}َادٌ`]
    ];
    return pola.map((p,i) => ({no:i+1, dhamir:p[0], fiil:p[1]}));
  }

  getSifatMusyabihat() {
    return [
      {wazan:'فَعِيل', fiil: `${this.f}َ${this.ain}ِيْد`},
      {wazan:'فَعُول', fiil: `${this.f}َ${this.ain}ُوْد`},
      {wazan:'فَعِل', fiil: `${this.f}َ${this.ain}ِد`}
    ];
  }

  getSemuaJamak() {
    return {
      dariFiil: {
        taksir: [
          {wazan:'فُعُول', fiil: `${this.f}ُ${this.ain}ُوْد`},
          {wazan:'فِعَال', fiil: `${this.f}ِ${this.ain}َاد`}
        ],
        muntahal: [{wazan:'مَفَاعِل', fiil: `مَ${this.f}َ${this.ain}َاد`}]
      },
      dariIsimFail: {
        taksir: [
          {wazan:'فُعَّال', fiil: `${this.f}ُ${this.ain}َّال`},
          {wazan:'فَعَلَة', fiil: `${this.f}َ${this.ain}َلَة`}
        ],
        muntahal: [{wazan:'فَعَائِل', fiil: this.idghom(`${this.f}َ${this.ain}${this.lam}`)+'َائِل'}]
      },
      dariIsimMaful: {
        taksir: [{wazan:'مَفَاعِيل', fiil: `مَ${this.f}َ${this.ain}َاوِيْد`}],
        muntahal: [{wazan:'مَفَاعِيل', fiil: `مَ${this.f}َ${this.ain}َاوِيْد`}]
      },
      dariIsimZaman: {
        taksir: [{wazan:'مَفَاعِل', fiil: `مَ${this.f}َ${this.ain}َاد`}],
        muntahal: [{wazan:'مَفَاعِل', fiil: `مَ${this.f}َ${this.ain}َاد`}]
      },
      dariIsimMakan: {
        taksir: [{wazan:'مَفَاعِل', fiil: `مَ${this.f}َ${this.ain}َاد`}],
        muntahal: [{wazan:'مَفَاعِل', fiil: `مَ${this.f}َ${this.ain}َاد`}]
      },
      dariIsimAlat: {
        taksir: [
          {wazan:'مَفَاعِيل', fiil: `مَ${this.f}َ${this.ain}َاوِد`},
          {wazan:'مَفَاعِل', fiil: `مَ${this.f}َ${this.ain}َاد`}
        ],
        muntahal: [
          {wazan:'مَفَاعِيل', fiil: `مَ${this.f}َ${this.ain}َاوِد`},
          {wazan:'مَفَاعِل', fiil: `مَ${this.f}َ${this.ain}َاد`}
        ]
      }
    };
  }

  getMasdar23() {
    const wazan = [
      `${this.f}َ${this.ain}ًّا`, `${this.f}ِ${this.ain}َادًا`, `تَ${this.f}ْ${this.ain}ِيْدًا`,
      `اِ${this.f}ْ${this.ain}َادًا`, `اِ${this.f}ْ${this.ain}ِيدًا`, `مَ${this.f}ًّا`,
      `مَ${this.f}َ${this.ain}ًّا`, `${this.f}َ${this.ain}ْدَة`, `${this.f}َ${this.ain}ِيدَة`,
      `تَ${this.f}ْ${this.ain}َادَة`, `اِ${this.f}ْ${this.ain}َادَة`, `${this.f}َ${this.ain}ِّيَة`,
      `مُ${this.f}َ${this.ain}ًّا`, `${this.f}َ${this.ain}ُوْدًا`, `${this.f}ِ${this.ain}َادَة`,
      `اِسْ${this.f}ْ${this.ain}َادًا`, `اِسْ${this.f}ْ${this.ain}ِدَة`, `مِ${this.f}َ${this.ain}ًّا`,
      `${this.f}َ${this.ain}َّاء`, `اِ${this.f}ْ${this.ain}َّاء`, `تَ${this.f}ْ${this.ain}َّاء`,
      `اِسْ${this.f}ْ${this.ain}َّاء`, `${this.f}ِ${this.ain}َّاء`
    ];
    return wazan.map((m,i) => ({no:i+1, masdar:m}));
  }

  getMarrah() {
    return [
      {wazan:'فَعْلَة', fiil: `${this.f}َ${this.ain}َّة`},
      {wazan:'فِعْلَة', fiil: `${this.f}ِ${this.ain}َّة`}
    ];
  }

  getNau() {
    return [
      {wazan:'فِعْلَة', fiil: `${this.f}ِ${this.ain}َّة`},
      {wazan:'فُعْلَة', fiil: `${this.f}ُ${this.ain}َّة`}
    ];
  }

  getIsimTafdhil() {
    return {
      mudzakkar: `أَ${this.f}ّ${this.lam}ُ`,
      muannats: `${this.f}ُ${this.ain}َّى`,
      jamak: `أَفَ${this.f}ِ${this.lam}ُ`
    };
  }
}

// CARA PAKE - 1 FILE UNTUK 6 BAB
console.log(new OtakMudhoafAllBab('م د', 1).tasrif().istilah[1]); // Bab 1: يَمُدُّ
console.log(new OtakMudhoafAllBab('ح ب', 2).tasrif().istilah[1]); // Bab 2: يَحِبُّ
console.log(new OtakMudhoafAllBab('ف ر', 3).tasrif().istilah[1]); // Bab 3: يَفِرُّ
console.log(new OtakMudhoafAllBab('م ر', 4).tasrif().istilah[1]); // Bab 4: يَمَرُّ
console.log(new OtakMudhoafAllBab('ج ل', 5).tasrif().istilah[1]); // Bab 5: يَجُلُّ
console.log(new OtakMudhoafAllBab('ح س', 6).tasrif().istilah[1]); // Bab 6: يَحْسِبُ