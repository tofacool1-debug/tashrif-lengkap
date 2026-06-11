class OtakMahmuzAllBab {
  constructor(asal = 'أ خ ذ', bab = 1) {
    this.asal = asal;
    [this.f, this.ain, this.lam] = asal.split(' ');
    this.bab = bab;

    // DETEKSI MAHMUZ MANA
    this.jenisMahmuz = this.f === 'ء'? 'Mahmuz Fa' : this.ain === 'ء'? 'Mahmuz Ain' : 'Mahmuz Lam';
    this.hurufHamzah = this.f === 'ء'? this.f : this.ain === 'ء'? this.ain : this.lam;

    this.setting = {
      1: {madhi:'َ', mudhari:'ُ', wazanMadhi:'فَعَلَ', wazanMudhari:'يَفْعُلُ', contoh:'أَخَذَ يَأْخُذُ'},
      2: {madhi:'َ', mudhari:'ِ', wazanMadhi:'فَعَلَ', wazanMudhari:'يَفْعِلُ', contoh:'سَأَلَ يَسْأَلُ'},
      3: {madhi:'َ', mudhari:'َ', wazanMadhi:'فَعَلَ', wazanMudhari:'يَفْعَلُ', contoh:'قَرَأَ يَقْرَأُ'}
    }[bab];
  }

  // MESIN HAMZAH MAHMUZ: ابدال + نقل + تسهيل
  iilalHamzah(fiil, posisi) {
    let hasil = fiil;

    // 1. ABADAL: ء + ساكن → مد. أُؤْخِذ → أُوْخِذ
    hasil = hasil.replace('ءْ', 'وْ').replace('ءْ', 'يْ');

    // 2. NAKL: hamzah dipindah ke huruf sebelum + sukun
    if(posisi === 'mudhari' && this.jenisMahmuz === 'Mahmuz Ain') {
      hasil = hasil.replace('ْءَ', 'َأْ').replace('ْءُ', 'ُأْ').replace('ْءِ', 'ِأْ');
    }

    // 3. TAS-HIL: hamzah jadi antara hamzah + huruf. أَأْخُذ → أَخُذ
    if(this.jenisMahmuz === 'Mahmuz Fa' && hasil.startsWith('أَء')) {
      hasil = hasil.replace('أَء', 'أ');
    }

    return hasil;
  }

  tasrif() {
    const h1 = this.setting.madhi;
    const h2 = this.setting.mudhari;

    return {
      asal: this.asal,
      bina: this.jenisMahmuz,
      bab: this.bab,
      wazan: `${this.setting.wazanMadhi} ${this.setting.wazanMudhari}`,
      hurufHamzah: this.hurufHamzah,
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
    const madhi = this.iilalHamzah(`${this.f}${h1}${this.ain}${h1}${this.lam}${h1}`, 'madhi');
    const mudhari = this.iilalHamzah(`يَ${this.f}${h1}${this.ain}${h2}${this.lam}${h2}`, 'mudhari');
    const amar = this.iilalHamzah(`اُ${this.f}${h1}${this.ain}${h2}${this.lam}${h2}`, 'amar');

    return [
      {no:1, nama:'الماضي', fiil: madhi, wazan:this.setting.wazanMadhi, iilal:this.getIilal('madhi')},
      {no:2, nama:'المضارع', fiil: mudhari, wazan:this.setting.wazanMudhari, iilal:this.getIilal('mudhari')},
      {no:3, nama:'الأمر', fiil: amar, wazan:'اُفْعُلْ', iilal:this.getIilal('amar')},
      {no:4, nama:'النهي', fiil: `لَا تَ${this.f}${h1}${this.ain}ْ${this.lam}`, wazan:'لَا تَفْعُلْ'},
      {no:5, nama:'المصدر', fiil: `${this.f}${h1}${this.ain}ْ${this.lam}ًا`, wazan:'فَعْلًا', contoh:'أَخْذًا'},
      {no:6, nama:'اسم الفاعل', fiil: `${this.f}َ${this.ain}ِ${this.lam}ٌ`, wazan:'فَاعِلٌ', contoh:'آخِذٌ'},
      {no:7, nama:'اسم المفعول', fiil: `مَ${this.f}ْ${this.ain}ُ${this.lam}ٌ`, wazan:'مَفْعُوْلٌ', contoh:'مَأْخُوْذٌ'},
      {no:8, nama:'اسم التفضيل', fiil: `أَ${this.f}ْ${this.ain}${this.lam}ُ`, wazan:'أَفْعَلُ'},
      {no:9, nama:'اسم الزمان', fiil: `مَ${this.f}${h1}${this.lam}ٌ`, wazan:'مَفْعَلٌ'},
      {no:10, nama:'اسم المكان', fiil: `مَ${this.f}${h1}${this.lam}ٌ`, wazan:'مَفْعَلٌ'},
      {no:11, nama:'اسم الآلة', fiil: `مِ${this.f}${h1}${this.lam}`, wazan:'مِفْعَلٌ'},
      {no:12, nama:'اسم التصغير', fiil: `${this.f}ُ${this.ain}َيْ${this.lam}`, wazan:'فُعَيْلٌ'}
    ];
  }

  getIilal(bentuk) {
    if(this.jenisMahmuz === 'Mahmuz Fa') return 'ابدال + تسهيل';
    if(this.jenisMahmuz === 'Mahmuz Ain' && bentuk === 'mudhari') return 'نقل';
    if(this.jenisMahmuz === 'Mahmuz Lam') return '-';
    return 'ابدال';
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
      ['هو', this.iilalHamzah(`${this.f}${h1}${this.ain}${h1}${this.lam}${h1}`, 'madhi')],
      ['هي', this.iilalHamzah(`${this.f}${h1}${this.ain}${h1}${this.lam}َتْ`, 'madhi')],
      ['أنتَ', `${this.f}${h1}${this.ain}${h1}${this.lam}ْتَ`],
      ['أنتِ', `${this.f}${h1}${this.ain}${h1}${this.lam}ْتِ`],
      ['أنا', `${this.f}${h1}${this.ain}${h1}${this.lam}ْتُ`],
      ['نحن', `${this.f}${h1}${this.ain}${h1}${this.lam}ْنَا`],
      ['هما', this.iilalHamzah(`${this.f}${h1}${this.ain}${h1}${this.lam}َا`, 'madhi')],
      ['هم', this.iilalHamzah(`${this.f}${h1}${this.ain}${h1}${this.lam}ُوْا`, 'madhi')],
      ['هن', `${this.f}${h1}${this.ain}${h1}${this.lam}ْـنَ`],
      ['أنتما', `${this.f}${h1}${this.ain}${h1}${this.lam}ْتُمَا`],
      ['أنتم', `${this.f}${h1}${this.ain}${h1}${this.lam}ْتُمْ`],
      ['أنتن', `${this.f}${h1}${this.ain}${h1}${this.lam}ْتُنَّ`],
      ['هما مؤنث', this.iilalHamzah(`${this.f}${h1}${this.ain}${h1}${this.lam}َتَا`, 'madhi')],
      ['نحن متكلم', `${this.f}${h1}${this.ain}${h1}${this.lam}ْنَا`]
    ];
    return pola.map((p,i) => ({no:i+1, dhamir:p[0], fiil:p[1], iilal: p[1].includes('آ')? 'مد' : '-'}));
  }

  getLughowiMudhari14(h1, h2) {
    const pola = [
      ['هو', this.iilalHamzah(`يَ${this.f}${h1}${this.ain}${h2}${this.lam}${h2}`, 'mudhari')],
      ['هي', this.iilalHamzah(`تَ${this.f}${h1}${this.ain}${h2}${this.lam}${h2}`, 'mudhari')],
      ['أنتَ', this.iilalHamzah(`تَ${this.f}${h1}${this.ain}${h2}${this.lam}${h2}`, 'mudhari')],
      ['أنتِ', `تَ${this.f}${h1}${this.ain}${h2}${this.lam}ِيْنَ`],
      ['أنا', this.iilalHamzah(`أَ${this.f}${h1}${this.ain}${h2}${this.lam}${h2}`, 'mudhari')],
      ['نحن', this.iilalHamzah(`نَ${this.f}${h1}${this.ain}${h2}${this.lam}${h2}`, 'mudhari')],
      ['هما', `يَ${this.f}${h1}${this.ain}${h2}${this.lam}َانِ`],
      ['هم', `يَ${this.f}${h1}${this.ain}${h2}${this.lam}ُوْنَ`],
      ['هن', `يَ${this.f}${h1}${this.ain}${h2}${this.lam}ْـنَ`],
      ['أنتما', `تَ${this.f}${h1}${this.ain}${h2}${this.lam}َانِ`],
      ['أنتم', `تَ${this.f}${h1}${this.ain}${h2}${this.lam}ُوْنَ`],
      ['أنتن', `تَ${this.f}${h1}${this.ain}${h2}${this.lam}ْـنَ`],
      ['هما مؤنث', `تَ${this.f}${h1}${this.ain}${h2}${this.lam}َانِ`],
      ['أنا متكلم', this.iilalHamzah(`أَ${this.f}${h1}${this.ain}${h2}${this.lam}${h2}`, 'mudhari')]
    ];
    return pola.map((p,i) => ({no:i+1, dhamir:p[0], fiil:p[1], iilal: p[1].includes('أْ')? 'نقل' : '-'}));
  }

  getLughowiAmar14(h1, h2) {
    const pola = [
      ['أنتَ', this.iilalHamzah(`اُ${this.f}${h1}${this.ain}${h2}${this.lam}${h2}`, 'amar')],
      ['أنتِ', `اِ${this.f}${h1}${this.ain}${h2}${this.lam}ِي`],
      ['أنتما', `اِ${this.f}${h1}${this.ain}${h2}${this.lam}َا`],
      ['أنتم', `اُ${this.f}${h1}${this.ain}${h2}${this.lam}ُوْا`],
      ['أنتن', `اُ${this.f}${h1}${this.ain}${h2}${this.lam}ْـنَ`]
    ];
    const lengkap = Array(14).fill(['-', '-']);
    pola.forEach((p,i) => lengkap[i] = p);
    return lengkap.map((p,i) => ({no:i+1, dhamir:p[0], fiil:p[1], iilal: p[1].includes('خُذ')? 'حذف همزة وصل' : '-'}));
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
    return lengkap.map((p,i) => ({no:i+1, dhamir:p[0], fiil:p[1], iilal:'-'}));
  }

  getLughowiIsimFail6() {
    const dasar = this.jenisMahmuz === 'Mahmuz Fa'?
      `آ${this.ain}ِ${this.lam}` :
      `${this.f}َ${this.ain}ِ${this.lam}`;

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
      {wazan:'فَعِل', fiil: `${this.f}${h1}${this.ain}ِ${this.lam}`, contoh:'أَخِذ'},
      {wazan:'فَعُول', fiil: `${this.f}${h1}${this.ain}ُ${this.lam}`, contoh:'أَخُوْذ'},
      {wazan:'فَعِيل', fiil: `${this.f}${h1}${this.ain}ِي${this.lam}`, contoh:'أَخِيْذ'}
    ];
  }

  getSemuaJamak(h1) {
    return {
      dariFiil: {
        taksir: [
          {wazan:'آخَاذ', fiil: `آ${this.ain}َاذ`, contoh:'آخَاذ'},
          {wazan:'مَآخِذ', fiil: `مَآ${this.ain}ِ${this.lam}`, contoh:'مَآخِذ'}
        ],
        muntahal: [
          {wazan:'مَفَاعِل', fiil: `مَ${this.f}َ${this.ain}ِ${this.lam}`, contoh:'مَآخِذ'}
        ]
      },
      dariIsimFail: {
        taksir: [
          {wazan:'فُعَّال', fiil: `${this.f}ُ${this.ain}َّ${this.lam}`, contoh:'أُخَّاذ'},
          {wazan:'فَعَلَة', fiil: `${this.f}َ${this.ain}َلَة`, contoh:'أَخَذَة'}
        ],
        muntahal: [
          {wazan:'فَعَائِل', fiil: `${this.f}َ${this.ain}ِ${this.lam}َائِل`, contoh:'آخِذَة'}
        ]
      },
      dariIsimMaful: {
        taksir: [
          {wazan:'مَفَاعِيل', fiil: `مَ${this.f}َ${this.ain}َاوِي${this.lam}`, contoh:'مَآخِيْذ'}
        ],
        muntahal: [
          {wazan:'مَفَاعِيل', fiil: `مَ${this.f}َ${this.ain}َاوِي${this.lam}`, contoh:'مَآخِيْذ'}
        ]
      },
      dariIsimZaman: {
        taksir: [{wazan:'مَفَاعِل', fiil: `مَ${this.f}َ${this.ain}ِ${this.lam}`}],
        muntahal: [{wazan:'مَفَاعِل', fiil: `مَ${this.f}َ${this.ain}ِ${this.lam}`}]
      },
      dariIsimMakan: {
        taksir: [{wazan:'مَفَاعِل', fiil: `مَ${this.f}َ${this.ain}ِ${this.lam}`}],
        muntahal: [{wazan:'مَفَاعِل', fiil: `مَ${this.f}َ${this.ain}ِ${this.lam}`}]
      },
      dariIsimAlat: {
        taksir: [
          {wazan:'مَفَاعِيل', fiil: `مَ${this.f}َ${this.ain}َاوِي${this.lam}`},
          {wazan:'مَفَاعِل', fiil: `مَ${this.f}َ${this.ain}ِ${this.lam}`}
        ],
        muntahal: [
          {wazan:'مَفَاعِيل', fiil: `مَ${this.f}َ${this.ain}َاوِي${this.lam}`},
          {wazan:'مَفَاعِل', fiil: `مَ${this.f}َ${this.ain}ِ${this.lam}`}
        ]
      }
    };
  }

  getMasdar23(h1) {
    return [
      {no:1, masdar: `${this.f}${h1}${this.ain}ْ${this.lam}ًا`, contoh:'أَخْذًا'},
      {no:2, masdar: `${this.f}ِ${this.ain}َ${this.lam}ًا`, contoh:'إِخَاذًا'}
    ];
  }

  getMarrah(h1) {
    return [
      {wazan:'فَعْلَة', fiil: `${this.f}${h1}${this.ain}ْ${this.lam}َة`, contoh:'أَخْذَة'}
    ];
  }

  getNau(h1) {
    return [
      {wazan:'فِعْلَة', fiil: `${this.f}ِ${this.ain}ْ${this.lam}َة`, contoh:'إِخْذَة'}
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

// TEST CONTOH أ خ ذ MAHMUZ FA BAB 1
const otak = new OtakMahmuzAllBab('أ خ ذ', 1);
const hasil = otak.tasrif();

console.log('=== MAHMUZ FA BAB 1 أ خ ذ ===');
console.log(hasil.bina); // Mahmuz Fa
console.log(hasil.istilah[0]); // الماضي: أَخَذَ
console.log(hasil.istilah[1]); // المضارع: يَأْخُذُ
console.log(hasil.istilah[2]); // الأمر: خُذْ - iilal: حذف همزة وصل
console.log(hasil.lughowi.isimFail[0]); // آخِذٌ - iilal: مد

// TEST CONTOH س أ ل MAHMUZ AIN BAB 2
const otak2 = new OtakMahmuzAllBab('س أ ل', 2);
console.log('\n=== MAHMUZ AIN BAB 2 س أ ل ===');
console.log(otak2.istilah[1]); // المضارع: يَسْأَلُ → يَسَلُ iilal: نقل