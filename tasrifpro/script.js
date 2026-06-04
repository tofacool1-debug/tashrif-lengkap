
// === LOAD HURUF SESUAI BAB ===
function tampilkanBab() {
  let bab = document.getElementById('bab').value;
  let hurufSelect = document.getElementById('huruf');
  let fiilSelect = document.getElementById('fiil');

  hurufSelect.innerHTML = '<option value="">Pilih Huruf</option>';
  fiilSelect.innerHTML = '<option value="">Pilih Fi\'il</option>';
  document.getElementById('hasil').innerHTML = '';

  let hurufList = Object.keys(dataBab[bab] || {});
  hurufList.sort(); // urut hijaiyah ا ب ت ث...

  hurufList.forEach(h => {
    hurufSelect.innerHTML += `<option value="${h}">حرف ${h}</option>`;
  });
}

// === LOAD FI'IL SESUAI HURUF ===
function tampilkanHuruf() {
  let bab = document.getElementById('bab').value;
  let huruf = document.getElementById('huruf').value;
  let fiilSelect = document.getElementById('fiil');

  fiilSelect.innerHTML = '<option value="">Pilih Fi\'il</option>';
  document.getElementById('hasil').innerHTML = '';

  let listFiil = dataBab[bab][huruf] || [];
  listFiil.forEach(f => {
    fiilSelect.innerHTML += `<option value='${JSON.stringify(f)}'>${f.madhi} - ${f.arti}</option>`;
  });
}

// === TAMPILIN TASRIF ISTILAH + MUSYTAQOT ===
function tampilkanFiil() {
  let data = JSON.parse(document.getElementById('fiil').value);
  if (!data) return;

  let fa = data.fa;
  let ain = data.ain;
  let lam = data.lam;
  let illat = data.illat;
  let madhi = data.madhi;

  // === 14 SHIGHOH TASRIF ISTILAH ===
  function binaMadhi(dh) {
    let p = {"هو":`${fa}${ain}َ${lam}َ`, "هما":`${fa}${ain}َ${lam}َا`, "هم":`${fa}${ain}َ${lam}ُوْا`,
      "هي":`${fa}${ain}َ${lam}َتْ`, "هما-م":`${fa}${ain}َ${lam}َتَا`, "هن":`${fa}${ain}َ${lam}ْنَ`,
      "انت":`${fa}${ain}َ${lam}ْتَ`, "انتما":`${fa}${ain}َ${lam}ْتُمَا`, "انتم":`${fa}${ain}َ${lam}ْتُمْ`,
      "انتِ":`${fa}${ain}َ${lam}ْتِ`, "انتما-م":`${fa}${ain}َ${lam}ْتُمَا`, "انتن":`${fa}${ain}َ${lam}ْتُنَّ`,
      "انا":`${fa}${ain}َ${lam}ْتُ`, "نحن":`${fa}${ain}َ${lam}ْنَا`};
    return p[dh];
  }

  function binaMudhori(dh) {
    let p = {"هو":`يَ${fa}${ain}ُ${lam}`, "هما":`يَ${fa}${ain}ُ${lam}َانِ`, "هم":`يَ${fa}${ain}ُ${lam}ُوْنَ`,
      "هي":`تَ${fa}${ain}ُ${lam}`, "هما-م":`تَ${fa}${ain}ُ${lam}َانِ`, "هن":`يَ${fa}${ain}ُ${lam}ْنَ`,
      "انت":`تَ${fa}${ain}ُ${lam}`, "انتما":`تَ${fa}${ain}ُ${lam}َانِ`, "انتم":`تَ${fa}${ain}ُ${lam}ُوْنَ`,
      "انتِ":`تَ${fa}${ain}ُ${lam}ِيْنَ`, "انتما-م":`تَ${fa}${ain}ُ${lam}َانِ`, "انتن":`تَ${fa}${ain}ُ${lam}ْنَ`,
      "انا":`اَ${fa}${ain}ُ${lam}`, "نحن":`نَ${fa}${ain}ُ${lam}`};
    let base = p[dh];
    if (illat === "ajwaf_waw") base = base.replace(ain, "و");
    if (illat === "ajwaf_yai") base = base.replace(ain, "ي");
    if (illat === "mitsal_waw") base = base.replace(fa, "");
    if (illat === "naqish_waw") base = base.replace(lam, "و");
    if (illat === "naqish_yai") base = base.replace(lam, "ي");
    if (illat === "mudhoaf") base = base.replace(ain+lam, ain+"ّ");
    return base;
  }

  function binaAmar(dh) {
    let p = {"انت":`اُ${fa}${ain}ْ${lam}`, "انتما":`اُ${fa}${ain}ْ${lam}َا`, "انتم":`اُ${fa}${ain}ْ${lam}ُوْا`,
      "انتِ":`اُ${fa}${ain}ْ${lam}ِيْ`, "انتما-م":`اُ${fa}${ain}ْ${lam}َا`, "انتن":`اُ${fa}${ain}ْ${lam}ْنَ`};
    let base = p[dh] || "";
    if (illat === "ajwaf_waw") base = base.replace(ain, "").replace("اُ", "");
    if (illat === "ajwaf_yai") base = base.replace(ain, "").replace("اُ", "");
    if (illat === "mitsal_waw") base = base.replace(fa, "").replace("اُ", "");
    if (illat === "mahmuz_fa") base = base.replace(fa, "").replace("اُ", "");
    if (illat === "mudhoaf") base = base.replace(ain+lam, ain+"ّ");
    return base;
  }

  function binaNahi(dh) {
    return binaMudhori(dh).replace(/^يَ|^تَ|^اَ|^نَ/, "لَا تَ").replace(/.$/, "");
  }

  // === 6 MUSYTAQOT ===
  let isimFail = `${fa}َاعِلٌ`;
  if (illat === "ajwaf_waw") isimFail = `${fa}َائِلٌ`;
  if (illat === "naqish_yai") isimFail = `${fa}${ain}ٍ`;

  let isimMaful = `مَ${fa}ْ${ain}ُوْ${lam}`;
  if (illat === "ajwaf_waw") isimMaful = `مَ${fa}ُوْ${lam}`;

  let isimZamanMakan = `مَ${fa}ْ${ain}َ${lam}`;
  let isimAlat = `مِ${fa}ْ${ain}َ${lam}`;
  let isimTafdhil = illat === "salim"? `أَ${fa}ْ${ain}َ${lam}` : `-`;
  let sifatMusyabbah = illat === "salim"? `${fa}َ${ain}ِ${lam}ٌ` : `-`;

  // === HTML OUTPUT ===
  let html = `<h3 style="color:#4ade80">تَصْرِيف: ${madhi} - ${data.arti}</h3>`;

  // TASRIF ISTILAH
  html += `<h4 style="color:#fbbf24; margin-top:15px">التصريف الاصطلاحي 14 صيغة</h4>`;
  html += `<table style="width:100%; border-collapse:collapse">`;
  [["الماضي", ["هو","هما","هم","هي","هما-م","هن","انت","انتما","انتم","انتِ","انتما-م","انتن","انا","نحن"]],
   ["المضارع", ["هو","هما","هم","هي","هما-م","هن","انت","انتما","انتم","انتِ","انتما-م","انتن","انا","نحن"]],
   ["الأمر", ["انت","انتما","انتم","انتِ","انتما-م","انتن"]],
   ["النهي", ["انت","انتما","انتم","انتِ","انتما-م","انتن"]]]
 .forEach(([judul, dhomirList]) => {
    html += `<tr><td colspan="2" style="padding:10px 0; color:#60a5fa">${judul}</td></tr>`;
    dhomirList.forEach(dh => {
      let sighat = judul==="الماضي"? binaMadhi(dh) :
                   judul==="المضارع"? binaMudhori(dh) :
                   judul==="الأمر"? binaAmar(dh) : binaNahi(dh);
      html += `<tr style="border-bottom:1px solid #333">
        <td style="padding:5px; width:20%">${dh}</td>
        <td style="padding:5px; text-align:right; font-size:18px">${sighat}</td>
      </tr>`;
    });
  });
  html += `</table>`;

  // MUSYTAQOT
  html += `<h4 style="color:#fbbf24; margin-top:20px">المشتقات 6</h4>`;
  html += `<table style="width:100%; border-collapse:collapse">
    <tr style="background:#2a2a2a"><th style="padding:8px; text-align:left">الاسم</th><th style="padding:8px; text-align:right">الصيغة</th></tr>
    <tr style="border-bottom:1px solid #333"><td>اسم الفاعل</td><td style="text-align:right; font-size:18px">${isimFail}</td></tr>
    <tr style="border-bottom:1px solid #333"><td>اسم المفعول</td><td style="text-align:right; font-size:18px">${isimMaful}</td></tr>
    <tr style="border-bottom:1px solid #333"><td>اسم الزمان/المكان</td><td style="text-align:right; font-size:18px">${isimZamanMakan}</td></tr>
    <tr style="border-bottom:1px solid #333"><td>اسم الآلة</td><td style="text-align:right; font-size:18px">${isimAlat}</td></tr>
    <tr style="border-bottom:1px solid #333"><td>اسم التفضيل</td><td style="text-align:right; font-size:18px">${isimTafdhil}</td></tr>
    <tr><td>الصفة المشبهة</td><td style="text-align:right; font-size:18px">${sifatMusyabbah}</td></tr>
  </table>`;

  document.getElementById('hasil').innerHTML = html;
}
