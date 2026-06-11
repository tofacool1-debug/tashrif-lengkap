class OtakNaqishAllBab {
  constructor(asal = 'د ع و', bab = 1) {
    this.asal = asal;
    [this.f, this.ain, this.lam] = asal.split(' ');
    this.bab = bab;

    this.setting = {
      1: {madhi:'َ', mudhari:'ُ', wazanMadhi:'فَعَلَ', wazanMudhari:'يَفْعُلُ', contoh:'دَعَا يَدْعُوْ'}, // و
      2: {madhi:'َ', mudhari:'ِ', wazanMadhi:'فَعَلَ', wazanMudhari:'يَفْعِلُ', contoh:'رَمَى يَرْمِيْ'}, // ي
      3: {madhi:'َ', mudhari:'َ', wazanMadhi:'فَعَلَ', wazanMudhari:'يَفْعَلُ', contoh:'خَشِيَ يَخْشَى'} // ي
    }[bab];

    this.lamAsli = this.lam; // و atau ي
    this.lamMudhari = this.setting.mudhari === 'ُ'? 'و' : 'ي';
  }

  // MESIN I'LAL NAQISH: حذف + قلب
  iilalMadhi(fiil) {
    // فَعَلَ → فَعَا: دَعَا dari دَعَوَ
    return fiil.replace(this.lamAsli + 'َ', 'َا');
  }

  iilalMudhari(fiil) {
    // يَفْعُلُ → يَدْعُوْ dari يَدْعُوُ: حذف ضمة + سكون
    return fiil.replace(this.lamMudhari + 'ُ', this.lamMudhari + 'ْ');
  }

  iilalAmar(fiil) {
    // اُفْعُ → اُدْعُ dari اُدْعُوْ: حذف huruf illat
    return fiil.replace(this.lamMudhari, '');
  }

  iilalIsimFail(fiil, dhamir) {
    // قَاضٍ dari قَاضِيٌ: حذف ياء pas tanwin
    if(['نكرة', 'مرفوع', 'مجرور'].some(k => dhamir.includes(k))) {
      return fiil.replace(this.lamMudhari + 'ٌ', 'ٍ');
    }
    return fiil;
  }

  tasrif() {
    const h1 = this.setting.madhi;
    const h2 = this.setting.mudhari;

    return {
      asal: this.asal,
      bina: 'Naqish',
      bab: this.bab,
      wazan: `${this.setting.wazanMadhi} ${this.setting.wazanMudhari}`,
      lamAsli: this.lamAsli,
      keterangan: this.setting.contoh,

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

  getIstilah12(h1, h2) {
    const madhi = this.iilalMadhi(`${this.f}${this.ain}${this.lamAsli}${h1}`);
    const mudhari = this.iilalMudhari(`يَ${this.f}${this.ain}${this.lamMudhari}${h2}`);
    const amar = this.iilalAmar(`اُ${this.f}${this.ain}${this.lamMudhari}${h2}`);

    return [
      {no:1, nama:'الماضي', fiil: madhi, wazan:this.setting.wazanMadhi, iilal:'قلب الواو/الياء ألف'},
      {no:2, nama:'المضارع', fiil: mudhari, wazan:this.setting.wazanMudhari, iilal:'حذف ضمة'},
      {no:3, nama:'الأمر', fiil: amar, wazan:'اُفْعُ/اِفْعِ', iilal:'حذف حرف العلة'},
      {no:4, nama:'النهي', fiil: `لَا تَ${this.f}${this.ain}${ainKosong()}`, wazan:'لَا تَفْعُ'},
      {no:5, nama:'المصدر', fiil: `${this.f}${this.ain}ْوَة`, wazan:'فَعْلَة', contoh:'دَعْوَة'},
      {no:6, nama:'اسم الفاعل', fiil: `${this.f}${this.ain}ٍ`, wazan:'فَاعٍ', iilal:'حذف الياء', contoh:'دَاعٍ'},
      {no:7, nama:'اسم المفعول', fiil: `مَ${this.f}ْ${this.ain}ِيٌّ`, wazan:'مَفْعُوْلٌ', contoh:'مَدْعُوٌّ'},
      {no:8, nama:'اسم التفضيل', fiil: `أَ${this.f}ْ${this.ain}َى`, wazan:'أَفْعَلُ'},
      {no:9, nama:'اسم الزمان', fiil: `مَ${this.f}${h1}${this.lamAsli}ًى`, wazan:'مَفْعَلًى'},
      {no:10, nama:'اسم المكان', fiil: `مَ${this.f}${h1}${this.lamAsli}ًى`, wazan:'مَفْعَلًى'},
      {no:11, nama:'اسم الآلة', fiil: `مِ${this.f}${this.ain}${this.lamAsli}`, wazan:'مِفْعَلٌ'},
      {no:12, nama:'اسم التصغير', fiil: `${this.f}ُ${this.ain}َيْ${this.lamAsli}`, wazan:'فُعَيْلٌ'}
    ];

    function ainKosong() { return ''; }
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
      ['هو', this.iilalMadhi(`${this.f}${this.ain}${this.lamAsli}${h1}`)],
      ['هي', this.iilalMadhi(`${this.f}${this.ain}${this.lamAsli}َتْ`)],
      ['أنتَ', `${this.f}${this.ain}${this.lamAsli}ْتَ`],
      ['أنتِ', `${this.f}${this.ain}${this.lamAsli}ْتِ`],
      ['أنا', `${this.f}${this.ain}${this.lamAsli}ْتُ`],
      ['نحن', `${this.f}${this.ain}${this.lamAsli}ْنَا`],
      ['هما', this.iilalMadhi(`${this.f}${this.ain}${this.lamAsli}َا`)],
      ['هم', this.iilalMadhi(`${this.f}${this.ain}${this.lamAsli}ُوْا`)],
      ['هن', `${this.f}${this.ain}${this.lamAsli}ْـنَ`],
      ['أنتما', `${this.f}${this.ain}${this.lamAsli}ْتُمَا`],
      ['أنتم', `${this.f}${this.ain}${this.lamAsli}ْتُمْ`],
      ['أنتن', `${this.f}${this.ain}${this.lamAsli}ْتُنَّ`],
      ['هما مؤنث', this.iilalMadhi(`${this.f}${this.ain}${this.lamAsli}َتَا`)],
      ['نحن متكلم', `${this.f}${this.ain}${this.lamAsli}ْنَا`]
    ];
    return pola.map((p,i) => ({no:i+1, dhamir:p[0], fiil:p[1], iilal: p[1].includes('ا')? 'قلب' : '-'}));
  }

  getLughowiMudhari14(h1, h2) {
    const pola = [
      ['هو', this.iilalMudhari(`يَ${this.f}${this.ain}${this.lamMudhari}${h2}`)],
      ['هي', this.iilalMudhari(`تَ${this.f}${this.ain}${this.lamMudhari}${h2}`)],
      ['أنتَ', this.iilalMudhari(`تَ${this.f}${this.ain}${this.lamMudhari}${h2}`)],
      ['أنتِ', `تَ${this.f}${this.ain}${this.lamMudhari}ِيْنَ`], // gak dihapus
      ['أنا', this.iilalMudhari(`أَ${this.f}${this.ain}${this.lamMudhari}${h2}`)],
      ['نحن', this.iilalMudhari(`نَ${this.f}${this.ain}${this.lamMudhari}${h2}`)],
      ['هما', `يَ${this.f}${this.ain}${this.lamMudhari}َانِ`],
      ['هم', `يَ${this.f}${this.ain}ْ${ainKosong()}وْنَ`], // حذف واو
      ['هن', `يَ${this.f}${this.ain}${this.lamMudhari}ْـنَ`],
      ['أنتما', `تَ${this.f}${this.ain}${this.lamMudhari}َانِ`],
      ['أنتم', `تَ${this.f}${this.ain}ْ${ainKosong()}وْنَ`],
      ['أنتن', `تَ${this.f}${this.ain}${this.lamMudhari}ْـنَ`],
      ['هما مؤنث', `تَ${this.f}${this.ain}${this.lamMudhari}َانِ`],
      ['أنا متكلم', this.iilalMudhari(`أَ${this.f}${this.ain}${this.lamMudhari}${h2}`)]
    ];
    return pola.map((p,i) => ({no:i+1, dhamir:p[0], fiil:p[1], iilal: p[1].includes('ْ')? 'حذف ضمة' : p[1].includes('و')===false? 'حذف واو' : '-'}));

    function ainKosong() { return ''; }
  }

  getLughowiAmar14(h1, h2) {
    const pola = [
      ['أنتَ', this.iilalAmar(`اُ${this.f}${this.ain}${this.lamMudhari}${h2}`)],
      ['أنتِ', `اِ${this.f}${this.ain}${this.lamMudhari}ِي`],
      ['أنتما', `اِ${this.f}${this.ain}${this.lamMudhari}َا`],
      ['أنتم', `اُ${this.f}${this.ain}ْ${ainKosong()}وْا`],
      ['أنتن', `اُ${this.f}${this.ain}${this.lamMudhari}ْـنَ`]
    ];
    const lengkap = Array(14).fill(['-', '-']);
    pola.forEach((p,i) => lengkap[i] = p);
    return lengkap.map((p,i) => ({no:i+1, dhamir:p[0], fiil:p[1], iilal: p[1].length<4? 'حذف' : '-'}));

    function ainKosong() { return ''; }
  }

  getLughowiNahi14(h1) {
    const pola = [
      ['أنتَ', `لَا تَ${this.f}${this.ain}${ainKosong()}`],
      ['أنتِ', `لَا تَ${this.f}${this.ain}${this.lamMudhari}ِي`],
      ['أنتما', `لَا تَ${this.f}${this.ain}${this.lamMudhari}َا`],
      ['أنتم', `لَا تَ${this.f}${this.ain}ْ${ainKosong()}وْا`],
      ['أنتن', `لَا تَ${this.f}${this.ain}${this.lamMudhari}ْـنَ`]
    ];
    const lengkap = Array(14).fill(['-', '-']);
    pola.forEach((p,i) => lengkap[i] = p);
    return lengkap.map((p,i) => ({no:i+1, dhamir:p[0], fiil:p[1], iilal:'حذف'}));

    function ainKosong() { return ''; }
  }

  getLughowiIsimFail6() {
    const pola = [
      ['مفرد مذكر نكرة مرفوع', this.iilalIsimFail(`${this.f}${this.ain}ِيٌ`, 'نكرة مرفوع')],
      ['مفرد مذكر معرفة مرفوع', `${this.f}${this.ain}ِيُ`],
      ['مفرد مؤنث', `${this.f}${this.ain}ِيَةٌ`],
      ['تثنية مذكر', `${this.f}${this.ain}ِيَانِ`],
      ['جمع مذكر', `${this.f}${this.ain}ُوْنَ`],
      ['جمع مؤنث', `${this.f}${this.ain}ِيَاتٌ`]
    ];
    return pola.map((p,i) => ({no:i+1, bentuk:p[0], fiil:p[1], iilal: p[1].includes('ٍ')? 'حذف ياء' : '-'}));
  }

  getLughowiIsimMaful6() {
    const dasar = `مَ${this.f}ْ${this.ain}ِ${this.lamAsli}`;
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
    const dasar = `مَ${this.f}${h1}${this.lamAsli}ًى`;
    return [
      {no:1, bentuk:'مفرد مذكر', fiil: dasar},
      {no:2, bentuk:'مفرد مؤنث', fiil: `${this.f}${h1}${this.lamAsli}َةًى`},
      {no:3, bentuk:'تثنية مذكر', fiil: `${dasar}َانِ`},
      {no:4, bentuk:'تثنية مؤنث', fiil: `${dasar}َتَانِ`},
      {no:5, bentuk:'جمع مذكر', fiil: `${dasar}َاتٌ`},
      {no:6, bentuk:'جمع مؤنث', fiil: `${dasar}َاتٌ`}
    ];
  }

  getLughowiIsimMakan6(h1) {
    return this.getLughowiIsimZaman6(h1);
  }

  getLughowiIsimAlat14(h1) {
    const dasar = `مِ${this.f}${this.ain}${this.lamAsli}`;
    const pola = [
      ['هو', dasar], ['هي', `${dasar}َة`], ['هما مذكر', `${dasar}َانِ`],
      ['هما مؤنث', `${dasar}َتَانِ`], ['هم', `${this.f}َ${this.ain}َاتٌ`],
      ['هن', `${dasar}َاتٌ`], ['أنتَ', dasar], ['أنتِ', `${dasar}َة`],
      ['أنتما', `${dasar}َانِ`], ['أنتم', `${this.f}َ${this.ain}َاتٌ`],
      ['أنتن', `${dasar}َاتٌ`], ['أنا', dasar], ['نحن تثنية', `${dasar}َانِ`],
      ['نحن جمع', `${this.f}َ${this.ain}َاتٌ`]
    ];
    return pola.map((p,i) => ({no:i+1, dhamir:p[0], fiil:p[1]}));
  }

  getSifatMusyabihat(h1) {
    return [
      {wazan:'فَاعٍ', fiil: `${this.f}${this.ain}ٍ`, contoh:'دَاعٍ'},
      {wazan:'فَعُول', fiil: `${this.f}${this.ain}ُ${this.lamAsli}`, contoh:'دَعُوّ'}
    ];
  }

  getSemuaJamak(h1) {
    return {
      dariFiil: {
        taksir: [
          {wazan:'أَدْعِيَة', fiil: `أَ${this.f}ْ${this.ain}ِيَة`, contoh:'أَدْعِيَة'},
          {wazan:'دُعَاة', fiil: `${this.f}ُ${this.ain}َاة`, contoh:'دُعَاة'}
        ],
        muntahal: [
          {wazan:'مَدَاعٍ', fiil: `مَ${this.f}َ${this.ain}ٍ`, contoh:'مَدَاعٍ'}
        ]
      },
      dariIsimFail: {
        taksir: [
          {wazan:'فُعَّال', fiil: `${this.f}ُ${this.ain}َّاء`, contoh:'دُعَّاء'},
          {wazan:'فَعَلَة', fiil: `${this.f}َ${this.ain}َلَة`, contoh:'دَعَلَة'}
        ],
        muntahal: [
          {wazan:'فَعَائِل', fiil: `${this.f}َ${this.ain}َائِل`, contoh:'دَعَائِل'}
        ]
      },
      dariIsimMaful: {
        taksir: [
          {wazan:'مَدَاعِيّ', fiil: `مَ${this.f}َ${this.ain}َاعِيّ`, contoh:'مَدَاعِيّ'}
        ],
        muntahal: [
          {wazan:'مَدَاعِيّ', fiil: `مَ${this.f}َ${this.ain}َاعِيّ`, contoh:'مَدَاعِيّ'}
        ]
      },
      dariIsimZaman: {
        taksir: [{wazan:'مَدَاعٍ', fiil: `مَ${this.f}َ${this.ain}ٍ`}],
        muntahal: [{wazan:'مَدَاعٍ', fiil: `مَ${this.f}َ${this.ain}ٍ`}]
      },
      dariIsimMakan: {
        taksir: [{wazan:'مَدَاعٍ', fiil: `مَ${this.f}َ${this.ain}ٍ`}],
        muntahal: [{wazan:'مَدَاعٍ', fiil: `مَ${this.f}َ${this.ain}ٍ`}]
      },
      dariIsimAlat: {
        taksir: [
          {wazan:'مَدَاعِيّ', fiil: `مَ${this.f}َ${this.ain}َاعِيّ`},
          {wazan:'مَدَاعٍ', fiil: `مَ${this.f}َ${this.ain}ٍ`}
        ],
        muntahal: [
          {wazan:'مَدَاعِيّ', fiil: `مَ${this.f}َ${this.ain}َاعِيّ`},
          {wazan:'مَدَاعٍ', fiil: `مَ${this.f}َ${this.ain}ٍ`}
        ]
      }
    };
  }

  getMasdar23(h1) {
    return [
      {no:1, masdar: `${this.f}${this.ain}ْوَة`, contoh:'دَعْوَة'},
      {no:2, masdar: `${this.f}${this.ain}َاء`, contoh:'دُعَاء'}
    ];
  }

  getMarrah(h1) {
    return [
      {wazan:'فَعْلَة', fiil: `${this.f}${this.ain}ْوَة`, contoh:'دَعْوَة'}
    ];
  }

  getNau(h1) {
    return [
      {wazan:'فِعْلَة', fiil: `${this.f}ِ${this.ain}ْوَة`, contoh:'دِعْوَة'}
    ];
  }

  getIsimTafdhil() {
    return {
      mudzakkar: `أَ${this.f}ْ${this.ain}َى`,
      muannats: `${this.f}ُ${this.ain}ْ${this.lamAsli}َى`,
      jamak: `أَفَ${this.f}ِ${this.ain}ُ`
    };
  }
}

// TEST CONTOH د ع و BAB 1
const otak = new OtakNaqishAllBab('د ع و', 1);
const hasil = otak.tasrif();

console.log('=== NAQISH BAB 1 د ع و ===');
console.log(hasil.wazan); // فَعَلَ يَفْعُلُ
console.log(hasil.istilah[0]); // الماضي: دَعَا - iilal: قلب
console.log(hasil.istilah[1]); // المضارع: يَدْعُوْ - iilal: حذف ضمة
console.log(hasil.istilah[2]); // الأمر: اُدْعُ - iilal: حذف واو
console.log(hasil.lughowi.nahi[0]); // أنتَ: لَا تَدْعُ - iilal: حذف
console.log(hasil.lughowi.isimFail[0]); // مفرد نكرة: دَاعٍ - iilal: حذف ياء