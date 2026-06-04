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
  let fa = fiil.fa, ain = fiil.ain, lam = fiil.lam;
  let illat = fiil.illat;

  let hasil = {
    madhi: fa + ain + lam,
    mudhori: "",
    amar: "",
    nahi: "",
    isim_fa: "",
    isim_maf: "",
    zaman_makan: "",
    alat: "",
    catatan: ""
  };

  // Pola dasar Bab 1 فَعَلَ يَفْعُلُ
  let polaMudhori = "يَ" + fa + "ْ" + ain + "ُ" + lam + "ُ";
  let polaAmar = "اُ" + fa + "ْ" + ain + "ُ" + lam;
  let polaNahi = "لَا تَ" + fa + "ْ" + ain + "ُ" + lam;
  let polaIsimFa = fa + "َا" + ain + "ِ" + lam;
  let polaIsimMaf = "مَ" + fa + "ْ" + ain + "ُ" + lam;
  let polaZaman = "مَ" + fa + "ْ" + ain + "َ" + lam;
  let polaAlat = "مِ" + fa + "ْ" + ain + "َ" + lam;

  switch(illat) {
    
    case "salim":
      hasil.mudhori = polaMudhori;
      hasil.amar = polaAmar;
      hasil.nahi = polaNahi;
      hasil.isim_fa = polaIsimFa;
      hasil.isim_maf = polaIsimMaf;
      hasil.zaman_makan = polaZaman;
      hasil.alat = polaAlat;
      break;

    case "mitsal_waw":
      hasil.mudhori = "يَ" + ain + "ِ" + lam + "ُ";
      hasil.amar = "عِ" + lam;
      hasil.nahi = "لَا تَ" + ain + "ِ" + lam;
      hasil.isim_fa = fa + "َا" + ain + "ِ" + lam;
      hasil.isim_maf = "مَ" + fa + "ْ" + ain + "ُ" + lam;
      hasil.zaman_makan = "مَ" + fa + "ْ" + ain + "َ" + lam;
      hasil.alat = "مِ" + fa + "ْ" + ain + "َ" + lam;
      hasil.catatan = "Waw dibuang di mudhori' & amar";
      break;

    case "ajwaf_waw":
      hasil.mudhori = "يَ" + fa + "ُو" + lam + "ُ";
      hasil.amar = "قُلْ";
      hasil.nahi = "لَا تَقُلْ";
      hasil.isim_fa = fa + "َا" + lam;
      hasil.isim_maf = "مَقُوْ" + lam;
      hasil.zaman_makan = "مَقَا" + lam;
      hasil.alat = "مِقَا" + lam;
      hasil.catatan = "Waw 'ain jadi Alif";
      break;

    case "naqish_yai":
      hasil.mudhori = "يَ" + fa + "ْ" + ain + "ِي";
      hasil.amar = "اِ" + fa + "ْ" + ain + "ِ";
      hasil.nahi = "لَا تَ" + fa + "ْ" + ain + "ِ";
      hasil.isim_fa = fa + "َا" + ain + "ٍ";
      hasil.isim_maf = "مَ" + fa + "ْ" + ain + "ِ" + lam;
      hasil.zaman_makan = "مَ" + fa + "ْ" + ain + "َ" + lam;
      hasil.alat = "مِ" + fa + "ْ" + ain + "َ" + lam;
      hasil.catatan = "Ya' lam dibuang pas amar + isim fa'il";
      break;

    case "mudhoaf":
      hasil.mudhori = "يَ" + fa + "ُ" + lam + "ُّ";
      hasil.amar = "اُ" + fa + "ْ" + lam + "ُّ";
      hasil.nahi = "لَا تَ" + fa + "ْ" + lam + "ُّ";
      hasil.isim_fa = fa + "َا" + lam + "ٌّ";
      hasil.isim_maf = "مَ" + fa + "ْ" + lam + "ُّ";
      hasil.zaman_makan = "مَ" + fa + "ْ" + lam + "ٌّ";
      hasil.alat = "مِ" + fa + "ْ" + lam + "ٌّ";
      hasil.catatan = "Tasydid di 'ain lam";
      break;

    // ... tambah case mitsal_yai, ajwaf_yai, naqish_waw, lafif_mafruq, lafif_maqrun, mahmuz dst sesuai kode sebelumnya
    default:
      hasil.mudhori = polaMudhori;
      hasil.amar = polaAmar;
      hasil.nahi = polaNahi;
      hasil.isim_fa = polaIsimFa;
      hasil.isim_maf = polaIsimMaf;
      hasil.zaman_makan = polaZaman;
      hasil.alat = polaAlat;
  }

  return hasil;
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
