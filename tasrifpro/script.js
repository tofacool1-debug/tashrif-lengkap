
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
function tampilkanFiil() {
  let data = JSON.parse(document.getElementById('fiil').value);
  if (!data) return;

  let fa = data.fa;
  let ain = data.ain;
  let lam = data.lam;
  let illat = data.illat;
  let madhi = data.madhi;

  // === 1. BANGUN FI'IL 4 DOANG ===
  
  // MADHI
  let madhiForm = madhi;

  // MUDHORI'
  let mudhori = `يَ${fa}${ain}ُ${lam}`;
  if (illat === "ajwaf_waw") mudhori = `يَ${fa}ُوْ${lam}`; // يقول
  if (illat === "ajwaf_yai") mudhori = `يَ${fa}ِيْ${lam}`; // يبيع
  if (illat === "mitsal_waw") mudhori = `يَ${ain}ِ${lam}`; // يعد
  if (illat === "mitsal_yai") mudhori = `يَ${ain}ِ${lam}`; // ييسر
  if (illat === "mahmuz_fa") mudhori = `يَ${fa}ْ${ain}ُ${lam}`; // يأخذ
  if (illat === "naqish_waw") mudhori = `يَ${fa}${ain}ُوْ`; // يدعو
  if (illat === "naqish_yai") mudhori = `يَ${fa}${ain}ِيْ`; // يرمي
  if (illat === "lafif_mafruq") mudhori = `يَ${ain}ِيْ`; // يفي
  if (illat === "lafif_maqrun") mudhori = `يَ${fa}ُوْ`; // يطوي
  if (illat === "mudhoaf") mudhori = `يَ${fa}ُ${ain}ُّ`; // يمدّ

  // AMAR
  let amar = `اُ${fa}${ain}ْ${lam}`;
  if (illat === "ajwaf_waw") amar = `${fa}ُلْ`; // قل
  if (illat === "ajwaf_yai") amar = `${fa}ِعْ`; // بع
  if (illat === "mitsal_waw") amar = `عِدْ`; // عد
  if (illat === "mahmuz_fa") amar = `${ain}ُ${lam}`; // خذ
  if (illat === "naqish_waw") amar = `اُ${fa}${ain}ْ`; // اُدْعُ
  if (illat === "naqish_yai") amar = `اِ${fa}${ain}ْ`; // اِرْمِ
  if (illat === "lafif_mafruq") amar = `فِ`; // فِ
  if (illat === "lafif_maqrun") amar = `اُطْوِ`; // اُطْوِ
  if (illat === "mudhoaf") amar = `${fa}ُ${ain}َّ`; // مُدَّ

  // NAHI
  let nahi = `لَا تَ${fa}${ain}ُ${lam}`;
  if (illat === "ajwaf_waw") nahi = `لَا تَ${fa}ُلْ`; // لا تقل
  if (illat === "ajwaf_yai") nahi = `لَا تَ${fa}ِعْ`; // لا تبع
  if (illat === "mitsal_waw") nahi = `لَا تَعِدْ`; // لا تعد
  if (illat === "mahmuz_fa") nahi = `لَا تَأْ${ain}ُ${lam}`; // لا تأخذ
  if (illat === "naqish_waw") nahi = `لَا تَ${fa}${ain}ُ`; // لا تدع
  if (illat === "naqish_yai") nahi = `لَا تَ${fa}${ain}ِ`; // لا ترم
  if (illat === "lafif_mafruq") nahi = `لَا تَفِ`; // لا تفِ
  if (illat === "lafif_maqrun") nahi = `لَا تَطْوِ`; // لا تطوِ
  if (illat === "mudhoaf") nahi = `لَا تَ${fa}ُ${ain}َّ`; // لا تمدّ

  // === 2. BANGUN 6 MUSYTAQOT ===
  
  // ISIM FA'IL
  let isimFail = `${fa}َاعِلٌ`;
  if (illat === "ajwaf_waw") isimFail = `${fa}َائِلٌ`; // قائل
  if (illat === "ajwaf_yai") isimFail = `${fa}َائِعٌ`; // بائع
  if (illat === "naqish_waw") isimFail = `${fa}${ain}ٍ`; // داعٍ
  if (illat === "naqish_yai") isimFail = `${fa}${ain}ٍ`; // رامٍ
  if (illat === "lafif_mafruq") isimFail = `وَافٍ`; // وافٍ
  if (illat === "lafif_maqrun") isimFail = `${fa}َاوٍ`; // طاوٍ

  // ISIM MAF'UL
  let isimMaful = `مَ${fa}ْ${ain}ُوْ${lam}`;
  if (illat === "ajwaf_waw") isimMaful = `مَ${fa}ُوْ${lam}`; // مقول
  if (illat === "ajwaf_yai") isimMaful = `مَ${fa}ِيْ${lam}`; // مبيع
  if (illat === "naqish_waw") isimMaful = `مَ${fa}ْ${ain}ُوٌّ`; // مدعوّ
  if (illat === "naqish_yai") isimMaful = `مَ${fa}ْ${ain}ِيٌّ`; // مرميّ
  if (illat === "lafif_mafruq") isimMaful = `مَوْفِيٌّ`; // موفيّ
  if (illat === "lafif_maqrun") isimMaful = `مَطْوِيٌّ`; // مطويّ

  // ISIM ZAMAN/MAKAN
  let isimZamanMakan = `مَ${fa}ْ${ain}َ${lam}`;
  if (illat === "ajwaf_waw") isimZamanMakan = `مَ${fa}َ${lam}`; // مقام
  if (illat === "mitsal_waw") isimZamanMakan = `مَ${ain}ِ${lam}`; // موعد
  if (illat === "naqish_yai") isimZamanMakan = `مَ${fa}ْ${ain}ًى`; // مرمى
  if (illat === "lafif_mafruq") isimZamanMakan = `مَوْفًى`; // موفى
  if (illat === "lafif_maqrun") isimZamanMakan = `مَطْوًى`; // مطوى

  // ISIM ALAT
  let isimAlat = `مِ${fa}ْ${ain}َ${lam}`;
  if (illat === "ajwaf_waw") isimAlat = `مِ${fa}ْوَلٌ`; // منقار
  if (illat === "mudhoaf") isimAlat = `مِ${fa}َ${ain}َّةٌ`; // مِدَقَّة

  // ISIM TAFDHIL
  let isimTafdhil = illat === "salim" ? `أَ${fa}ْ${ain}َ${lam}` : `-`;

  // SHIFAT MUSYABBAHAH
  let sifatMusyabbah = illat === "salim" ? `${fa}َ${ain}ِ${lam}ٌ` : `-`;

  // === OUTPUT HTML ===
  document.getElementById('hasil').innerHTML = `
    <div style="background:#1a1a1a; padding:15px; border-radius:8px">
      <h3 style="color:#4ade80">تَصْرِيف: ${madhi} - ${data.arti}</h3>
      
      <h4 style="color:#fbbf24; margin-top:15px">الفعل</h4>
      <table style="width:100%; border-collapse:collapse">
        <tr style="border-bottom:1px solid #333">
          <td style="padding:8px; width:30%">الماضي</td>
          <td style="padding:8px; text-align:right; font-size:18px">${madhiForm}</td>
        </tr>
        <tr style="border-bottom:1px solid #333">
          <td style="padding:8px">المضارع</td>
          <td style="padding:8px; text-align:right; font-size:18px">${mudhori}</td>
        </tr>
        <tr style="border-bottom:1px solid #333">
          <td style="padding:8px">الأمر</td>
          <td style="padding:8px; text-align:right; font-size:18px">${amar}</td>
        </tr>
        <tr>
          <td style="padding:8px">النهي</td>
          <td style="padding:8px; text-align:right; font-size:18px">${nahi}</td>
        </tr>
      </table>

      <h4 style="color:#fbbf24; margin-top:20px">المشتقات 6</h4>
      <table style="width:100%; border-collapse:collapse">
        <tr style="background:#2a2a2a">
          <th style="padding:8px; text-align:left">الاسم</th>
          <th style="padding:8px; text-align:right">الصيغة</th>
          <th style="padding:8px">الوزن</th>
        </tr>
        <tr style="border-bottom:1px solid #333">
          <td style="padding:8px">اسم الفاعل</td>
          <td style="padding:8px; text-align:right; font-size:18px">${isimFail}</td>
          <td style="padding:8px; text-align:center">فَاعِلٌ</td>
        </tr>
        <tr style="border-bottom:1px solid #333">
          <td style="padding:8px">اسم المفعول</td>
          <td style="padding:8px; text-align:right; font-size:18px">${isimMaful}</td>
          <td style="padding:8px; text-align:center">مَفْعُوْلٌ</td>
        </tr>
        <tr style="border-bottom:1px solid #333">
          <td style="padding:8px">اسم الزمان/المكان</td>
          <td style="padding:8px; text-align:right; font-size:18px">${isimZamanMakan}</td>
          <td style="padding:8px; text-align:center">مَفْعَلٌ</td>
        </tr>
        <tr style="border-bottom:1px solid #333">
          <td style="padding:8px">اسم الآلة</td>
          <td style="padding:8px; text-align:right; font-size:18px">${isimAlat}</td>
          <td style="padding:8px; text-align:center">مِفْعَلٌ</td>
        </tr>
        <tr style="border-bottom:1px solid #333">
          <td style="padding:8px">اسم التفضيل</td>
          <td style="padding:8px; text-align:right; font-size:18px">${isimTafdhil}</td>
          <td style="padding:8px; text-align:center">أَفْعَلُ</td>
        </tr>
        <tr>
          <td style="padding:8px">الصفة المشبهة</td>
          <td style="padding:8px; text-align:right; font-size:18px">${sifatMusyabbah}</td>
          <td style="padding:8px; text-align:center">فَعِيْلٌ</td>
        </tr>
      </table>
    </div>
  `;
}
