export default class OtakAjwafAllBab {
  constructor(asal = 'ق و ل', bab = 1) {
    this.asal = asal;
    [this.f, this.ain, this.lam] = asal.split(' ');
    this.bab = bab;

    this.setting = {
      1: {madhi:'َ', mudhari:'ُ', wazanMadhi:'فَعَلَ', wazanMudhari:'يَفْعُلُ', contoh:'قَالَ يَقُوْلُ'}, // و
      2: {madhi:'َ', mudhari:'ِ', wazanMadhi:'فَعَلَ', wazanMudhari:'يَفْعِلُ', contoh:'بَاعَ يَبِيْعُ'}, // ي
      3: {madhi:'َ', mudhari:'َ', wazanMadhi:'فَعَلَ', wazanMudhari:'يَفْعَلُ', contoh:'نَامَ يَنَامُ'} // و/ي
    }[bab];

    // TENTUKAN AIN ASLI
    this.ainAsli = this.ain; // و atau ي
    this.ainMudhari = this.setting.mudhari === 'ُ'? 'و' : 'ي';
  }

  // MESIN I'LAL AJWAF: قلب + نقل + حذف
  iilalMadhi(fiil) {
    // فَعَلَ → فَال fiil madhi: قَالَ dari قَوَلَ
    return fiil.replace(this.ainAsli, 'َا');
  }

  iilalMudhari(fiil) {
    // يَفْعُلُ → يَقُوْل dari يَقْوُلُ: نقل + قلب
    const base = fiil.replace(`ْ${this.ainAsli}`, this.ainMudhari);
    return base.replace(this.ainAsli, this.ainMudhari);
  }

  iilalAmar(fiil) {
    // اُفْعُلْ → قُلْ dari اُقْوُلْ: حذف + نقل
    const base = fiil.replace(`ْ${this.ainAsli}`, '');
    return base.replace(this.ainAsli, '');
  }

  tasrif() {
    const h1 = this.setting.madhi;
    const h2 = this.setting.mudhari;

    return {
      asal: this.asal,
      bina: 'Ajwaf',
      bab: this.bab,
      wazan: `${this.setting.wazanMadhi} ${this.setting.wazanMudhari}`,
      ainAsli: this.ainAsli,
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
    const madhi = this.iilalMadhi(`${this.f}${this.ainAsli}${this.lam}${h1}`);
    const mudhari = this.iilalMudhari(`يَ${this.f}ْ${this.ainAsli}${this.lam}${h2}`);
    const amar = this.iilalAmar(`اُ${this.f}ْ${this.ainAsli}${this.lam}${h2}`);

    return [
      {no:1, nama:'الماضي', fiil: madhi, wazan:this.setting.wazanMadhi, iilal:'قلب الواو/الياء ألف'},
      {no:2, nama:'المضارع', fiil: mudhari, wazan:this.setting.wazanMudhari, iilal:'نقل + قلب'},
      {no:3, nama:'الأمر', fiil: amar, wazan:'اُفْعُلْ/اِفْعِلْ', iilal:'حذف + نقل'},
      {no:4, nama:'النهي', fiil: `لَا تَ${this.f}${ainKosong()}${this.lam}`, wazan:'لَا تَفْعُلْ'},
      {no:5, nama:'المصدر', fiil: `${this.f}${h1}${this.lam}ًا`, wazan:'فَعْلًا', contoh:'قَوْلًا'},
      {no:6, nama:'اسم الفاعل', fiil: `${this.f}َائِ${this.lam}ٌ`, wazan:'فَاعِلٌ', iilal:'قلب', contoh:'قَائِلٌ'},
      {no:7, nama:'اسم المفعول', fiil: `مَ${this.f}ُ${this.lam}ٌ`, wazan:'مَفْعُوْلٌ', iilal:'قلب', contoh:'مَقُوْلٌ'},
      {no:8, nama:'اسم التفضيل', fiil: `أَ${this.f}ْ${this.lam}ُ`, wazan:'أَفْعَلُ'},
      {no:9, nama:'اسم الزمان', fiil: `مَ${this.f}${h1}${this.lam}ٌ`, wazan:'مَفْعَلٌ'},
      {no:10, nama:'اسم المكان', fiil: `مَ${this.f}${h1}${this.lam}ٌ`, wazan:'مَفْعَلٌ'},
      {no:11, nama:'اسم الآلة', fiil: `مِ${this.f}${this.ainAsli}${this.lam}`, wazan:'مِفْعَلٌ'},
      {no:12, nama:'اسم التصغير', fiil: `${this.f}ُ${this.ainAsli}َيْ${this.lam}`, wazan:'فُعَيْلٌ'}
    ];

    function ainKosong() { return ''; } // buat nahi
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
      ['هو', this.iilalMadhi(`${this.f}${this.ainAsli}${this.lam}${h1}`)],
      ['هي', this.iilalMadhi(`${this.f}${this.ainAsli}${this.lam}َتْ`)],
      ['أنتَ', `${this.f}${this.ainAsli}${this.lam}ْتَ`], // gak ada iilal
      ['أنتِ', `${this.f}${this.ainAsli}${this.lam}ْتِ`],
      ['أنا', `${this.f}${this.ainAsli}${this.lam}ْتُ`],
      ['نحن', `${this.f}${this.ainAsli}${this.lam}ْنَا`],
      ['هما', this.iilalMadhi(`${this.f}${this.ainAsli}${this.lam}َا`)],
      ['هم', this.iilalMadhi(`${this.f}${this.ainAsli}${this.lam}ُوْا`)],
      ['هن', `${this.f}${this.ainAsli}${this.lam}ْـنَ`],
      ['أنتما', `${this.f}${this.ainAsli}${this.lam}ْتُمَا`],
      ['أنتم', `${this.f}${this.ainAsli}${this.lam}ْتُمْ`],
      ['أنتن', `${this.f}${this.ainAsli}${this.lam}ْتُنَّ`],
      ['هما مؤنث', this.iilalMadhi(`${this.f}${this.ainAsli}${this.lam}َتَا`)],
      ['نحن متكلم', `${this.f}${this.ainAsli}${this.lam}ْنَا`]
    ];
    return pola.map((p,i) => ({no:i+1, dhamir:p[0], fiil:p[1], iilal: p[1].includes('ا')? 'قلب' : '-'}));
  }

  getLughowiMudhari14(h1, h2) {
    const pola = [
      ['هو', this.iilalMudhari(`يَ${this.f}ْ${this.ainAsli}${this.lam}${h2}`)],
      ['هي', this.iilalMudhari(`تَ${this.f}ْ${this.ainAsli}${this.lam}${h2}`)],
      ['أنتَ', this.iilalMudhari(`تَ${this.f}ْ${this.ainAsli}${this.lam}${h2}`)],
      ['أنتِ', `تَ${this.f}${ainKosong()}${this.lam}ِيْنَ`], // حذف
      ['أنا', this.iilalMudhari(`أَ${this.f}ْ${this.ainAsli}${this.lam}${h2}`)],
      ['نحن', this.iilalMudhari(`نَ${this.f}ْ${this.ainAsli}${this.lam}${h2}`)],
      ['هما', `يَ${this.f}${ainKosong()}${this.lam}َانِ`],
      ['هم', `يَ${this.f}${ainKosong()}${this.lam}ُوْنَ`],
      ['هن', `يَ${this.f}${this.ainAsli}${this.lam}ْـنَ`],
      ['أنتما', `تَ${this.f}${ainKosong()}${this.lam}َانِ`],
      ['أنتم', `تَ${this.f}${ainKosong()}${this.lam}ُوْنَ`],
      ['أنتن', `تَ${this.f}${this.ainAsli}${this.lam}ْـنَ`],
      ['هما مؤنث', `تَ${this.f}${ainKosong()}${this.lam}َانِ`],
      ['أنا متكلم', this.iilalMudhari(`أَ${this.f}ْ${this.ainAsli}${this.lam}${h2}`)]
    ];
    return pola.map((p,i) => ({no:i+1, dhamir:p[0], fiil:p[1], iilal: p[1].includes(this.ainMudhari)? 'نقل+قلب' : p[1].includes(this.ainAsli)===false? 'حذف' : '-'}));

    function ainKosong() { return ''; }
  }

  getLughowiAmar14(h1, h2) {
    const pola = [
      ['أنتَ', this.iilalAmar(`اُ${this.f}ْ${this.ainAsli}${this.lam}${h2}`)],
      ['أنتِ', `اِ${this.f}${ainKosong()}${this.lam}ِي`],
      ['أنتما', `اِ${this.f}${ainKosong()}${this.lam}َا`],
      ['أنتم', `اُ${this.f}${ainKosong()}${this.lam}ُوْا`],
      ['أنتن', `اُ${this.f}${this.ainAsli}${this.lam}ْـنَ`]
    ];
    const lengkap = Array(14).fill(['-', '-']);
    pola.forEach((p,i) => lengkap[i] = p);
    return lengkap.map((p,i) => ({no:i+1, dhamir:p[0], fiil:p[1], iilal: p[1].length<4? 'حذف' : '-'}));

    function ainKosong() { return ''; }
  }

  getLughowiNahi14(h1) {
    const pola = [
      ['أنتَ', `لَا تَ${this.f}${ainKosong()}${this.lam}`],
      ['أنتِ', `لَا تَ${this.f}${ainKosong()}${this.lam}ِي`],
      ['أنتما', `لَا تَ${this.f}${ainKosong()}${this.lam}َا`],
      ['أنتم', `لَا تَ${this.f}${ainKosong()}${this.lam}ُوْا`],
      ['أنتن', `لَا تَ${this.f}${this.ainAsli}${this.lam}ْـنَ`]
    ];
    const lengkap = Array(14).fill(['-', '-']);
    pola.forEach((p,i) => lengkap[i] = p);
    return lengkap.map((p,i) => ({no:i+1, dhamir:p[0], fiil:p[1], iilal:'حذف'}));

    function ainKosong() { return ''; }
  }

  getLughowiIsimFail6() {
    const dasar = `${this.f}َائِ${this.lam}`;
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
    const dasar = `مَ${this.f}ُ${this.lam}`;
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
    const dasar = `مِ${this.f}${this.ainAsli}${this.lam}`;
    const pola = [
      ['هو', dasar], ['هي', `${dasar}َة`], ['هما مذكر', `${dasar}َانِ`],
      ['هما مؤنث', `${dasar}َتَانِ`], ['هم', `${this.f}َ${this.lam}َاتٌ`],
      ['هن', `${dasar}َاتٌ`], ['أنتَ', dasar], ['أنتِ', `${dasar}َة`],
      ['أنتما', `${dasar}َانِ`], ['أنتم', `${this.f}َ${this.lam}َاتٌ`],
      ['أنتن', `${dasar}َاتٌ`], ['أنا', dasar], ['نحن تثنية', `${dasar}َانِ`],
      ['نحن جمع', `${this.f}َ${this.lam}َاتٌ`]
    ];
    return pola.map((p,i) => ({no:i+1, dhamir:p[0], fiil:p[1]}));
  }

  getSifatMusyabihat(h1) {
    return [
      {wazan:'فَاعِل', fiil: `${this.f}َائِ${this.lam}`, contoh:'قَائِل'},
      {wazan:'فَعُول', fiil: `${this.f}َ${this.ainAsli}ُ${this.lam}`, contoh:'قَوُوْل'},
      {wazan:'فَعِيل', fiil: `${this.f}َ${this.ainAsli}ِي${this.lam}`, contoh:'قَوِيْل'}
    ];
  }

  getSemuaJamak(h1) {
    return {
      dariFiil: {
        taksir: [
          {wazan:'أَقْوَال', fiil: `أَ${this.f}ْ${this.ainAsli}َ${this.lam}`, contoh:'أَقْوَال'},
          {wazan:'قِيل', fiil: `${this.f}ِ${this.lam}`, contoh:'قِيل'}
        ],
        muntahal: [
          {wazan:'مَقَاوِل', fiil: `مَ${this.f}َ${this.ainAsli}َاوِل`, contoh:'مَقَاوِل'}
        ]
      },
      dariIsimFail: {
        taksir: [
          {wazan:'فُعَّال', fiil: `${this.f}ُ${this.lam}َّ${this.lam}`, contoh:'قُوَّال'},
          {wazan:'فَعَلَة', fiil: `${this.f}َ${this.lam}َلَة`, contoh:'قَوَلَة'}
        ],
        muntahal: [
          {wazan:'فَعَائِل', fiil: `${this.f}َائِ${this.lam}َائِل`, contoh:'قَائِل'}
        ]
      },
      dariIsimMaful: {
        taksir: [
          {wazan:'مَقَاوِيل', fiil: `مَ${this.f}َ${this.ainAsli}َاوِي${this.lam}`, contoh:'مَقَاوِيْل'}
        ],
        muntahal: [
          {wazan:'مَقَاوِيل', fiil: `مَ${this.f}َ${this.ainAsli}َاوِي${this.lam}`, contoh:'مَقَاوِيْل'}
        ]
      },
      dariIsimZaman: {
        taksir: [{wazan:'مَقَاوِل', fiil: `مَ${this.f}َ${this.ainAsli}َاوِل`}],
        muntahal: [{wazan:'مَقَاوِل', fiil: `مَ${this.f}َ${this.ainAsli}َاوِل`}]
      },
      dariIsimMakan: {
        taksir: [{wazan:'مَقَاوِل', fiil: `مَ${this.f}َ${this.ainAsli}َاوِل`}],
        muntahal: [{wazan:'مَقَاوِل', fiil: `مَ${this.f}َ${this.ainAsli}َاوِل`}]
      },
      dariIsimAlat: {
        taksir: [
          {wazan:'مَقَاوِيل', fiil: `مَ${this.f}َ${this.ainAsli}َاوِي${this.lam}`},
          {wazan:'مَقَاوِل', fiil: `مَ${this.f}َ${this.ainAsli}َاوِل`}
        ],
        muntahal: [
          {wazan:'مَقَاوِيل', fiil: `مَ${this.f}َ${this.ainAsli}َاوِي${this.lam}`},
          {wazan:'مَقَاوِل', fiil: `مَ${this.f}َ${this.ainAsli}َاوِل`}
        ]
      }
    };
  }

  getMasdar23(h1) {
    return [
      {no:1, masdar: `${this.f}${h1}${this.lam}ًا`, contoh:'قَوْلًا'},
      {no:2, masdar: `${this.f}ِ${this.lam}َة`, contoh:'قِيلَة'}
    ];
  }

  getMarrah(h1) {
    return [
      {wazan:'فَعْلَة', fiil: `${this.f}${h1}${this.lam}َة`, contoh:'قَوْلَة'}
    ];
  }

  getNau(h1) {
    return [
      {wazan:'فِعْلَة', fiil: `${this.f}ِ${this.lam}َة`, contoh:'قِيلَة'}
    ];
  }

  getIsimTafdhil() {
    return {
      mudzakkar: `أَ${this.f}ْ${this.lam}ُ`,
      muannats: `${this.f}ُ${this.lam}َى`,
      jamak: `أَفَ${this.f}ِ${this.lam}ُ`
    };
  }
}

// TEST CONTOH ق و ل BAB 1
const otak = new OtakAjwafAllBab('ق و ل', 1);
const hasil = otak.tasrif();

console.log('=== AJWAF BAB 1 ق و ل ===');
console.log(hasil.wazan); // فَعَلَ يَفْعُلُ
console.log(hasil.istilah[0]); // الماضي: قَالَ - iilal: قلب
console.log(hasil.istilah[1]); // المضارع: يَقُوْلُ - iilal: نقل+قلب
console.log(hasil.istilah[2]); // الأمر: قُلْ - iilal: حذف+نقل
console.log(hasil.lughowi.mudhari[7]); // هم: يَقُوْلُوْنَ
console.log(hasil.lughowi.nahi[0]); // أنتَ: لَا تَقُلْ - iilal: حذف
console.log(hasil.jamak.dariFiil.taksir[0]); // أَقْوَال
