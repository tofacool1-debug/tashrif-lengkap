const urutanHijaiyah = "ابتثجحخدذرزسشصضطظعغفقكلمنهوي".split("");

function tampilHuruf() {
  let bab = document.getElementById('bab').value;
  let selectHuruf = document.getElementById('huruf');
  selectHuruf.innerHTML = '<option value="">-- Pilih Huruf --</option>';
  document.getElementById('fiil').innerHTML = '<option value="">-- Pilih Huruf Dulu --</option>';
  document.getElementById('hasil').innerHTML = '';

  // Ambil huruf awal Madhi, bukan fa'
  let hurufUnik = [...new Set(dataFiil.filter(f => f.bab === bab).map(f => f.madhi[0]))];

  // Urutin sesuai Hijaiyah, bukan abjad random
  hurufUnik.sort((a,b) => urutanHijaiyah.indexOf(a) - urutanHijaiyah.indexOf(b));

  hurufUnik.forEach(h => {
    let namaHuruf = getNamaHuruf(h);
    selectHuruf.innerHTML += `<option value='${h}'>${h} - ${namaHuruf}</option>`;
  });
}

function tampilFiil() {
  let bab = document.getElementById('bab').value;
  let huruf = document.getElementById('huruf').value;
  let selectFiil = document.getElementById('fiil');
  selectFiil.innerHTML = '<option value="">-- Pilih Fi\'il --</option>';

  // Filter: Bab harus sama + Huruf awal Madhi harus sama
  let filtered = dataFiil.filter(f => f.bab === bab && f.madhi[0] === huruf);
  filtered.forEach(f => {
    selectFiil.innerHTML += `<option value='${JSON.stringify(f)}'>${f.madhi} - ${f.arti}</option>`;
  });
}

function terapkanIilal(fiil) {
function terapkanIilal(fiil) {
  let fa = fiil.fa, ain = fiil.ain, lam = fiil.lam;
  let illat = fiil.illat; // "salim", "mitsal_waw", "mitsal_yai", "ajwaf_waw", "ajwaf_yai", "naqish_waw", "naqish_yai", "lafif_mafruq", "lafif_maqrun", "mahmuz_fa", "mahmuz_ain", "mahmuz_lam", "mudhoaf"

  let hasil = {
    madhi: fa + ain + lam,
    mudhori: "",
    amar: "",
    masdar: "",
    isim_fa: "",
    isim_maf: "",
    catatan: ""
  };

  // Pola dasar Bab 1 فَعَلَ يَفْعُلُ
  let polaMudhori = "يَ" + fa + "ْ" + ain + "ُ" + lam + "ُ";
  let polaAmar = "اُ" + fa + "ْ" + ain + "ُ" + lam;
  let polaMasdar = fa + "َ" + ain + "ْ" + lam + "ًا";
  let polaIsimFa = fa + "َا" + ain + "ِ" + lam;
  let polaIsimMaf = "مَ" + fa + "ْ" + ain + "ُ" + lam;

  switch(illat) {
    
    // 1. SHAHIH SALIM - normal, gak kena i'lal
    case "salim":
      hasil.mudhori = polaMudhori;
      hasil.amar = polaAmar;
      hasil.masdar = polaMasdar;
      hasil.isim_fa = polaIsimFa;
      hasil.isim_maf = polaIsimMaf;
      break;

    // 2. MITSAL WAWI - Fa' huruf illat Waw. Waw dibuang pas mudhori' amar
    case "mitsal_waw":
      hasil.mudhori = "يَ" + ain + "ِ" + lam + "ُ"; // وَعَدَ → يَعِدُ
      hasil.amar = "عِ" + lam; // عِدْ
      hasil.masdar = fa + "َ" + ain + "ْ" + lam + "ًا"; // وَعْدًا
      hasil.isim_fa = fa + "َا" + ain + "ِ" + lam; // وَاعِد
      hasil.isim_maf = "مَ" + fa + "ْ" + ain + "ُ" + lam;
      hasil.catatan = "Waw dibuang di mudhori' & amar";
      break;

    // 3. MITSAL YAI - Fa' huruf illat Ya'. Ya' tetap
    case "mitsal_yai":
      hasil.mudhori = "يَ" + fa + "ْ" + ain + "َ" + lam + "ُ"; // يَبِسَ → يَيْبَسُ
      hasil.amar = "اِ" + fa + "ْ" + ain + "َ" + lam; // اِيبَسْ
      hasil.masdar = polaMasdar;
      hasil.isim_fa = polaIsimFa;
      hasil.isim_maf = polaIsimMaf;
      hasil.catatan = "Ya' tetap, jarang dipake";
      break;

    // 4. AJWAF WAWI - 'Ain huruf illat Waw. Waw jadi Alif
    case "ajwaf_waw":
      hasil.mudhori = "يَ" + fa + "ُو" + lam + "ُ"; // قَالَ → يَقُوْلُ
      hasil.amar = "قُلْ"; // قُلْ - waw jadi dhommah
      hasil.masdar = fa + "َوْ" + lam + "ًا"; // قَوْلًا
      hasil.isim_fa = fa + "َا" + lam; // قَائِل
      hasil.isim_maf = "مَقُوْ" + lam; // مَقُوْل
      hasil.catatan = "Waw 'ain jadi Alif/Hamzah";
      break;

    // 5. AJWAF YAI - 'Ain huruf illat Ya'. Ya' jadi Alif
    case "ajwaf_yai":
      hasil.mudhori = "يَ" + fa + "ِي" + lam + "ُ"; // بَاعَ → يَبِيْعُ
      hasil.amar = "بِعْ"; // بِعْ - ya' jadi kasroh
      hasil.masdar = fa + "َيْ" + lam + "ًا"; // بَيْعًا
      hasil.isim_fa = fa + "َا" + lam; // بَائِع
      hasil.isim_maf = "مَبِيْ" + lam; // مَبِيْع
      hasil.catatan = "Ya' 'ain jadi Alif";
      break;

    // 6. NAQISH WAWI - Lam huruf illat Waw. Waw jadi Alif Maqshuroh
    case "naqish_waw":
      hasil.mudhori = "يَ" + fa + "ْ" + ain + "ُو"; // دَعَا → يَدْعُو
      hasil.amar = "اُ" + fa + "ْ" + ain + "ُ"; // اُدْعُ - waw dibuang
      hasil.masdar = fa + "َ" + ain + "ْو" + "ًا"; // دَعْوًا
      hasil.isim_fa = fa + "َا" + ain + "ٍ"; // دَاعٍ - tanwin
      hasil.isim_maf = "مَ" + fa + "ْ" + ain + "ُو"; // مَدْعُوّ
      hasil.catatan = "Waw lam jadi Alif, dibuang pas amar";
      break;

    // 7. NAQISH YAI - Lam huruf illat Ya'. Ya' jadi Alif Maqshuroh
    case "naqish_yai":
      hasil.mudhori = "يَ" + fa + "ْ" + ain + "ِي"; // رَمَى → يَرْمِي
      hasil.amar = "اِ" + fa + "ْ" + ain + "ِ"; // اِرْمِ - ya' dibuang
      hasil.masdar = fa + "َ" + ain + "ْ" + lam + "ًا"; // رَمْيًا
      hasil.isim_fa = fa + "َا" + ain + "ٍ"; // رَامٍ
      hasil.isim_maf = "مَ" + fa + "ْ" + ain + "ِ" + lam; // مَرْمِيّ
      hasil.catatan = "Ya' lam jadi Alif, dibuang pas amar";
      break;

    // 8. LAFIF MAFRUQ - Fa' + Lam huruf illat
    case "lafif_mafruq":
      hasil.mudhori = "يَ" + ain + "ِي"; // وَفَى → يَفِي
      hasil.amar = "فِ"; // فِ - waw + ya' dibuang
      hasil.masdar = fa + "َ" + ain + "ْ" + lam + "ًا"; // وَفَاءً
      hasil.isim_fa = fa + "َا" + ain + "ٍ"; // وَافٍ
      hasil.catatan = "Waw fa' + Ya' lam dibuang pas amar";
      break;

    // 9. LAFIF MAQRUN - 'Ain + Lam huruf illat
    case "lafif_maqrun":
      hasil.mudhori = "يَ" + fa + "ْو" + "ي"; // طَوَى → يَطْوِي
      hasil.amar = "اِ" + fa + "ْوِ"; // اِطْوِ
      hasil.masdar = fa + "َوْ" + lam + "ًا"; // طَيًّا
      hasil.isim_fa = fa + "َا" + lam; // طَاوٍ
      hasil.catatan = "Waw + Ya' kumpul di akhir";
      break;

    // 10. MAHMUZ - ada Hamzah
    case "mahmuz_fa":
      hasil.mudhori = "يَأْ" + ain + "ْ" + lam + "ُ"; // أَخَذَ → يَأْخُذُ
      hasil.amar = "خُذْ"; // خُذْ - hamzah washol
      hasil.masdar = "أَخْ" + ain + "ْ" + lam + "ًا";
      hasil.isim_fa = "آ" + ain + "ِ" + lam; // آخِذ
      hasil.catatan = "Hamzah di fa' fi'il";
      break;
    
    case "mahmuz_ain":
      hasil.mudhori = polaMudhori; // سَأَلَ → يَسْأَلُ
      hasil.amar = "اِسْأَلْ";
      hasil.masdar = fa + "َأْ" + lam + "ًا";
      hasil.catatan = "Hamzah di 'ain fi'il";
      break;

    case "mahmuz_lam":
      hasil.mudhori = "يَ" + fa + "ْ" + ain + "َأُ"; // قَرَأَ → يَقْرَأُ
      hasil.amar = "اِقْرَأْ";
      hasil.masdar = fa + "َ" + ain + "ْ" + "أً";
      hasil.catatan = "Hamzah di lam fi'il";
      break;

    // 11. MUDHO'AF - 'ain = lam
    case "mudhoaf":
      hasil.mudhori = "يَ" + fa + "ُ" + lam + "ُّ"; // مَدَّ → يَمُدُّ
      hasil.amar = "اُ" + fa + "ْ" + lam + "ُّ"; // اُمْدُدْ
      hasil.masdar = fa + "َ" + lam + "ًّا"; // مَدًّا
      hasil.isim_fa = fa + "َا" + lam + "ٌّ"; // مَادٌّ
      hasil.catatan = "Tasydid di 'ain lam";
      break;

    default:
      hasil.mudhori = polaMudhori;
      hasil.amar = polaAmar;
  }

  return hasil;
}

// Cara pake di HTML:
function tampilkanTasrif(madhi, fa, ain, lam, illat) {
  let fiil = {fa, ain, lam, illat};
  let tasrif = terapkanIilal(fiil);
  
  document.getElementById('hasil').innerHTML = `
    <b>Madhi:</b> ${tasrif.madhi}<br>
    <b>Mudhori':</b> ${tasrif.mudhori}<br>
    <b>Amar:</b> ${tasrif.amar}<br>
    <b>Masdar:</b> ${tasrif.masdar}<br>
    <b>Isim Fa'il:</b> ${tasrif.isim_fa}<br>
    <b>Isim Maf'ul:</b> ${tasrif.isim_maf}<br>
    <small>${tasrif.catatan}</small>
  `;
}

function tampilIstilah() {
  let f = fiilAktif;

  let mudhori = terapkanIilal(f, "mudhori");
  let amar = terapkanIilal(f, "amar");
  let nahi = terapkanIilal(f, "nahi");
  let masdar = terapkanIilal(f, "masdar");
  
  let fa=f.fa, ain=f.ain, lam=f.lam;
  let isimFa = "آ" + ain + "ِ" + lam;
  let isimMaf = "مَ" + fa + "ْ" + ain + "ُ" + lam;
  let zaman = "مَ" + fa + "ْ" + ain + "َ" + lam;

  let hasil = `
  <h3>Tasrif Istilah Mujarrod Bab 1</h3>
  <p><b>Madhi:</b> ${f.madhi}</p>
  <p><b>Mudhori':</b> ${mudhori}</p>
  <p><b>Amar:</b> ${amar}</p>
  <p><b>Nahi:</b> ${nahi}</p>
  <p><b>Masdar:</b> ${masdar}</p>
  <p><b>Isim Fa'il:</b> ${isimFa}</p>
  <p><b>Isim Maf'ul:</b> ${isimMaf}</p>
  <p><b>Zaman/Makan:</b> ${zaman}</p>
  <p><b>Arti Munawwir:</b> ${f.arti}</p>
  `;
  document.getElementById('hasil').innerHTML = hasil;
}
