class OtakLafifAllBab {
  constructor(asal = 'و ع ي', bab = 1, jenis = 'Maqrun') {
    this.asal = asal;
    [this.f, this.ain, this.lam] = asal.split(' ');
    this.bab = bab;
    this.bina = 'Lafif';
    this.jenis = jenis; // Maqrun = و + ي, Mafruq = و/ي + ي/و

    this.setting = {
      1: {madhi:'َ', mudhari:'ِ', wazanMadhi:'فَعَلَ', wazanMudhari:'يَفْعِلُ', contoh:'وَعَى يَعِي'}, // Maqrun
      2: {madhi:'ِ', mudhari:'َ', wazanMadhi:'فَعِلَ', wazanMudhari:'يَفْعَلُ', contoh:'وَقِيَ يَقِي'}, // Mafruq
      3: {madhi:'َ', mudhari:'ُ', wazanMadhi:'فَعَلَ', wazanMudhari:'يَفْعُلُ', contoh:'طَوَى يَطْوِي'} // Maqrun
    }[bab];
  }

  // MESIN I'LAL LAFIF: gabungan 3 i'lal
  iilalMudhari(fiil) {
    // 1. Mitsal: حذف فاء. يَوْعِي → يَعِي
    fiil = fiil.replace(this.f + 'ْ', '');

    // 2. Naqish: قلب lam illat jadi ya. يَعِيْ → يَعِي
    if(this.lam === 'ي' || this.lam === 'و') {
      fiil = fiil.replace(this.lam + 'ْ', this.lam);
    }

    // 3. Naqish: حذف lam di jazm. يَعِي → لَمْ يَعِ
    if(fiil.includes('لَمْ')) {
      fiil = fiil.replace(this.lam, '');
    }
    return fiil;
  }

  iilalAmar(fiil) {
    // اِوْعِي → عِ : حذف فاء + حذف lam + حذف همزة
    return fiil.replace('اِ' + this.f, '').replace(this.lam, '').replace('اِ', 'ِ');
  }

  iilalIsimFail(fiil) {
    // دَاعٍ → دَاعِي → دَاعٍ : حذف ya di waqof
    return fiil.replace(this.lam + 'ٌ', this.lam + 'ٍ');
  }

  getIilalFuuul() {
    // LAFIF PALING BRUTAL
    return 'حذف فاء + قلب + حذف + إدغام';
    // وَاعِي → وُعَّاي → وُعَّي → وُعَّي
  }

  tasrif() {
    const h1 = this.setting.madhi;
    const h2 = this.setting.mudhari;

    return {
      asal: this.asal,
      bina: `${this.bina} ${this.jenis}`,
      bab: this.bab,
      wazan: `${this.setting.wazanMadhi} ${this.setting.wazanMudhari}`,
      keterangan: this.setting.contoh,

      istilah: this.getIstilah12(h1, h2),
      lughowi: this.getSemuaLughowi(h1, h2),
      masdar: {
        masdar23: this.getMasdar23(h1),
        marrah: this.getMarrah(h1),
        nau: this.getNau(h1)
      },
      sifatMusyabihat: this.getSifatMusyabihat(h1),
      jamak: this.getSemuaJamak(h1), // UDAH ADA TRACKING I'LAL + JAMAK TAKSIR + MUNTAHAL
      isimTafdhil: this.getIsimTafdhil()
    };
  }

  getIstilah12(h1, h2) {
    const madhi = `${this.f}${h1}${this.ain}${h1}${this.lam}${h1}`;
    const mudhari = this.iilalMudhari(`يَ${this.f}ْ${this.ain}${h2}${this.lam}${h2}`);
    const amar = this.iilalAmar(`اِ${this.f}ْ${this.ain}${h2}${this.lam}${h2}`);
    const isimFail = this.iilalIsimFail(`${this.f}َ${this.ain}ِ${this.lam}ٌ`);

    return [
      {no:1, nama:'الماضي', fiil: madhi, wazan:this.setting.wazanMadhi, iilal:'-'},
      {no:2, nama:'المضارع', fiil: mudhari, wazan:this.setting.wazanMudhari, iilal:'حذف فاء + قلب'},
      {no:3, nama:'الأمر', fiil: amar, wazan:'اِفْعِلْ', iilal:'حذف فاء + حذف لام + حذف همزة'},
      {no:4, nama:'النهي', fiil: `لَا تَ${this.f}ْ${this.ain}ْ${this.lam}`, wazan:'لَا تَفْعِلْ'},
      {no:5, nama:'المصدر', fiil: `${this.f}${h1}${this.ain}ْ${this.lam}ًا`, wazan:'فَعْلًا', contoh:'وَعْيًا'},
      {no:6, nama:'اسم الفاعل', fiil: isimFail, wazan:'فَاعِلٌ', iilal:'حذف ياء', contoh:'وَاعٍ'},
      {no:7, nama:'اسم المفعول', fiil: `مَ${this.f}ْ${this.ain}ِ${this.lam}ٌ`, wazan:'مَفْعُولٌ'},
      {no:8, nama:'اسم التفضيل', fiil: `أَ${this.f}ْ${this.ain}${this.lam}ُ`, wazan:'أَفْعَلُ'},
      {no:9, nama:'اسم الزمان', fiil: `مَ${this.f}${h1}${this.lam}ٌ`, wazan:'مَفْعَلٌ'},
      {no:10, nama:'اسم المكان', fiil: `مَ${this.f}${h1}${this.lam}ٌ`, wazan:'مَفْعَلٌ'},
      {no:11, nama:'اسم الآلة', fiil: `مِ${this.f}${h1}${this.lam}`, wazan:'مِفْعَلٌ'},
      {no:12, nama:'اسم التصغير', fiil: `${this.f}ُ${this.ain}َيْ${this.lam}`, wazan:'فُعَيْلٌ'}
    ];
  }

  // ========== JAMAK + I'LAL LENGKAP + JAMAK TAKSIR + MUNTAHAL JUMU' ==========
  getSemuaJamak(h1) {
    const f = this.f, ain = this.ain, lam = this.lam;
    const iilalFuul = this.getIilalFuuul();

    return {
      dariFiil: {
        taksir: [
          {wazan:'أَفْعَال', fiil: `أَ${f}ْ${ain}َ${lam}`, asal:`أَ${f}ْ${ain}َ${lam}`, iilal:'-'},
          {wazan:'فُعُول', fiil: `${f}ُ${ain}ُ${lam}`, asal:`${f}ُ${ain}ُ${lam}`, iilal:'-'}
        ],
        muntahal: [
          {wazan:'فَعَائِل', fiil: `${f}َ${ain}َائِل`, asal:`${f}َ${ain}َائِل`, iilal:'-'}
        ]
      },
      dariIsimFail: {
        taksir: [
          {
            wazan:'فُعَّل',
            fiil: `${f}ُ${ain}َّ${lam}`,
            asal: `${f}ُ${ain}َّا${lam}`, // فُعَّال
            iilal: iilalFuul,
            contoh: 'وُعَّي' // وَاعِي → وُعَّاي → وُعَّي
          },
          {
            wazan:'فُعَّال',
            fiil: `${f}ُ${ain}َّ${lam}`,
            asal: `${f}ُ${ain}َّا${lam}`,
            iilal: iilalFuul,
            contoh: 'وُعَّي'
          },
          {
            wazan:'فَعَلَة',
            fiil: `${f}َ${ain}َلَة`,
            asal: `${f}َ${ain}َلَة`,
            iilal: '-',
            contoh: 'وَعَلَة'
          },
          {
            wazan:'فِعَال',
            fiil: `${f}ِ${ain}َال`,
            asal: `${f}ِ${ain}َال`,
            iilal: '-',
            contoh: 'وِعَال'
          }
        ],
        muntahal: [
          {
            wazan:'فَعَائِل',
            fiil: `${f}َ${ain}ِ${lam}َائِل`,
            asal: `${f}َ${ain}ِ${lam}َائِل`,
            iilal: 'حذف لام',
            contoh: 'وَاعِي'
          },
          {
            wazan:'فُعَلَاء',
            fiil: `${f}ُ${ain}َلَاء`,
            asal: `${f}ُ${ain}َلَاء`,
            iilal: 'حذف لام',
            contoh: 'وُعَلَاء'
          }
        ]
      },
      dariIsimMaful: {
        taksir: [
          {wazan:'مَفَاعِيل', fiil: `مَ${f}َ${ain}َاوِي${lam}`, asal:`مَ${f}َ${ain}َاوِي${lam}`, iilal:'قلب'},
          {wazan:'مَفْعُولُون', fiil: `مَ${f}ْ${ain}ِ${lam}ُوْن`, asal:`مَ${f}ْ${ain}ِ${lam}ُوْن`, iilal:'-'}
        ],
        muntahal: [
          {wazan:'مَفَاعِيل', fiil: `مَ${f}َ${ain}َاوِي${lam}`, asal:`مَ${f}َ${ain}َاوِي${lam}`, iilal:'قلب'}
        ]
      },
      dariIsimZaman: {
        taksir: [{wazan:'مَفَاعِل', fiil: `مَ${f}َ${ain}ِ${lam}`, asal:`مَ${f}َ${ain}ِ${lam}`, iilal:'-'}],
        muntahal: [{wazan:'مَفَاعِل', fiil: `مَ${f}َ${ain}ِ${lam}`, asal:`مَ${f}َ${ain}ِ${lam}`, iilal:'-'}]
      },
      dariIsimMakan: {
        taksir: [{wazan:'مَفَاعِل', fiil: `مَ${f}َ${ain}ِ${lam}`, asal:`${f}َ${ain}ِ${lam}`, iilal:'-'}],
        muntahal: [{wazan:'مَفَاعِل', fiil: `مَ${f}َ${ain}ِ${lam}`, asal:`${f}َ${ain}ِ${lam}`, iilal:'-'}]
      },
      dariIsimAlat: {
        taksir: [
          {wazan:'مَفَاعِيل', fiil: `مَ${f}َ${ain}َاوِي${lam}`, asal:`مَ${f}َ${ain}َاوِي${lam}`, iilal:'قلب'},
          {wazan:'مَفَاعِل', fiil: `مِ${f}${h1}${lam}`, asal:`مِ${f}${h1}${lam}`, iilal:'-'}
        ],
        muntahal: [
          {wazan:'مَفَاعِيل', fiil: `مَ${f}َ${ain}َاوِي${lam}`, asal:`مَ${f}َ${ain}َاوِي${lam}`, iilal:'قلب'},
          {wazan:'مَفَاعِل', fiil: `مِ${f}${h1}${lam}`, asal:`مِ${f}${h1}${lam}`, iilal:'-'}
        ]
      },
      // ========== INI TAMBAHANNYA BANG ==========
      dariSifatMusyabihat: {
        taksir: [
          {
            wazan:'فُعَلَاء',
            fiil: `${f}ُ${ain}َلَاء`,
            asal: `${f}ُ${ain}َلَاء`,
            iilal: 'حذف لام',
            contoh: 'وُعَلَاء' // وَقِي → وُقَيَاء → وُعَلَاء
          },
          {
            wazan:'فِعَال',
            fiil: `${f}ِ${ain}َال`,
            asal: `${f}ِ${ain}َال`,
            iilal: 'حذف لام',
            contoh: 'وِعَال' // وَقِي → وِقَي → وِعَال
          },
          {
            wazan:'فُعُل',
            fiil: `${f}ُ${ain}ُل`,
            asal: `${f}ُ${ain}ُل`,
            iilal: 'حذف لام',
            contoh: 'وُقُل'
          }
        ],
        muntahal: [
          {
            wazan:'فُعَلَاء',
            fiil: `${f}ُ${ain}َلَاء`,
            asal: `${f}ُ${ain}َلَاء`,
            iilal: 'حذف لام',
            contoh: 'وُعَلَاء'
          },
          {
            wazan:'فَعَائِل',
            fiil: `${f}َ${ain}َائِل`,
            asal: `${f}َ${ain}َائِل`,
            iilal: '-',
            contoh: 'وَعَائِل'
          }
        ]
      }
    };
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
      ['أنا', `${this.f}${h1}${this.ain}${h1}${this.lam}ْتُ`],
      ['هم', `${this.f}${h1}${this.ain}${h1}${this.lam}ُوْا`]
    ];
    return pola.map((p,i) => ({no:i+1, dhamir:p[0], fiil:p[1], iilal:'-'}));
  }

  getLughowiMudhari14(h1, h2) {
    const pola = [
      ['هو', this.iilalMudhari(`يَ${this.f}ْ${this.ain}${h2}${this.lam}${h2}`)],
      ['هي', this.iilalMudhari(`تَ${this.f}ْ${this.ain}${h2}${this.lam}${h2}`)],
      ['أنتَ', this.iilalMudhari(`تَ${this.f}ْ${this.ain}${h2}${this.lam}${h2}`)],
      ['هم', `يَ${this.f}ْ${this.ain}${h2}${this.lam}ُوْنَ`],
      ['هن', `يَ${this.f}ْ${this.ain}${h2}${this.lam}ْـنَ`]
    ];
    return pola.map((p,i) => ({no:i+1, dhamir:p[0], fiil:p[1], iilal:'حذف فاء + قلب'}));
  }

  getLughowiAmar14(h1, h2) {
    const pola = [
      ['أنتَ', this.iilalAmar(`اِ${this.f}ْ${this.ain}${h2}${this.lam}${h2}`)],
      ['أنتِ', `اِ${this.f}ْ${this.ain}${h2}${this.lam}ِي`],
      ['أنتم', `اِ${this.f}ْ${this.ain}${h2}${this.lam}ُوْا`]
    ];
    const lengkap = Array(14).fill(['-', '-']);
    pola.forEach((p,i) => lengkap[i] = p);
    return lengkap.map((p,i) => ({no:i+1, dhamir:p[0], fiil:p[1], iilal:'حذف فاء + حذف لام'}));
  }

  getLughowiNahi14(h1) {
    const pola = [
      ['أنتَ', `لَا تَ${this.f}ْ${this.ain}ْ${this.lam}`],
      ['أنتِ', `لَا تَ${this.f}ْ${this.ain}ْ${this.lam}ِي`]
    ];
    const lengkap = Array(14).fill(['-', '-']);
    pola.forEach((p,i) => lengkap[i] = p);
    return lengkap.map((p,i) => ({no:i+1, dhamir:p[0], fiil:p[1], iilal:'-'}));
  }

  getLughowiIsimFail6() {
    const dasar = this.iilalIsimFail(`${this.f}َ${this.ain}ِ${this.lam}`);
    return [
      {no:1, bentuk:'مفرد مذكر', fiil: `${dasar}ٌ`, iilal:'حذف ياء'},
      {no:2, bentuk:'مفرد مؤنث', fiil: `${dasar}َةٌ`, iilal:'-'},
      {no:3, bentuk:'جمع مذكر', fiil: `${dasar}ُوْنَ`, iilal:'حذف ياء'}
    ];
  }

  getLughowiIsimMaful6() {
    const dasar = `مَ${this.f}ْ${this.ain}ِ${this.lam}`;
    return [
      {no:1, bentuk:'مفرد مذكر', fiil: `${dasar}ٌ`},
      {no:2, bentuk:'مفرد مؤنث', fiil: `${dasar}َةٌ`}
    ];
  }

  getLughowiIsimZaman6(h1) {
    const dasar = `مَ${this.f}${h1}${this.lam}`;
    return [{no:1, bentuk:'مفرد مذكر', fiil: `${dasar}ٌ`}];
  }

  getLughowiIsimMakan6(h1) {
    return this.getLughowiIsimZaman6(h1);
  }

  getLughowiIsimAlat14(h1) {
    const dasar = `مِ${this.f}${h1}${this.lam}`;
    return [{no:1, dhamir:'هو', fiil: dasar}];
  }

  getSifatMusyabihat(h1) {
    return [
      {wazan:'فَعِل', fiil: `${this.f}${h1}${this.ain}ِ${this.lam}`, contoh:'وَقِي'}
    ];
  }

  getMasdar23(h1) {
    return [
      {no:1, masdar: `${this.f}${h1}${this.ain}ْ${this.lam}ًا`, contoh:'وَعْيًا'},
      {no:2, masdar: `${this.f}ِ${this.ain}َ${this.lam}ًا`, contoh:'وِعَاءً'}
    ];
  }

  getMarrah(h1) {
    return [{wazan:'فَعْلَة', fiil: `${this.f}${h1}${this.ain}ْ${this.lam}َة`, contoh:'وَعْيَة'}];
  }

  getNau(h1) {
    return [{wazan:'فِعْلَة', fiil: `${this.f}ِ${this.ain}ْ${this.lam}َة`, contoh:'وِعْيَة'}];
  }

  getIsimTafdhil() {
    return {
      mudzakkar: `أَ${this.f}ْ${this.ain}${this.lam}ُ`,
      muannats: `${this.f}ُ${this.ain}ْ${this.lam}َى`
    };
  }
}

export default OtakLafifAllBab;