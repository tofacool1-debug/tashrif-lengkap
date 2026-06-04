const selectBab = document.getElementById('bab');
const selectHuruf = document.getElementById('huruf');
const selectFiil = document.getElementById('fiil');
const hasilDiv = document.getElementById('hasil');
const btnTampil = document.getElementById('btnTampil');

// Isi huruf
selectBab.addEventListener('change', () => {
  selectHuruf.innerHTML = '<option value="">Pilih Huruf</option>';
  selectFiil.innerHTML = '<option value="">Pilih Fiil</option>';
  hasilDiv.innerHTML = '';
  let hurufList = Object.keys(dataBab[selectBab.value] || {});
  hurufList.forEach(h => {
    selectHuruf.innerHTML += `<option value="${h}">${h}</option>`;
  });
});

// Isi fiil - PENTING: value nya root polos tanpa harakat
selectHuruf.addEventListener('change', () => {
  selectFiil.innerHTML = '<option value="">Pilih Fiil Madhi</option>';
  hasilDiv.innerHTML = '';
  let fiilList = dataBab[selectBab.value][selectHuruf.value] || [];
  fiilList.forEach(f => {
    // Hapus harakat buat jadi root
    let root = f.madhi.replace(/[ًٌٍَُِّْ]/g, '');
    selectFiil.innerHTML += `<option value="${root}">${f.madhi} - ${f.arti}</option>`;
  });
});

// Ambil tasrif dari Qutrub langsung
btnTampil.addEventListener('click', async () => {
  let root = selectFiil.value;
  if(!root) return alert('Pilih fiil dulu bang!');

  hasilDiv.innerHTML = '<p style="text-align:center">⏳ Mengambil data tasrif...</p>';

  try {
    // Qutrub versi JSON API, gak kena CORS
    let url = `https://qutrub.arabeyes.org/sarf-json.php?verb=${root}&bab=1`;
    let res = await fetch(url);
    let data = await res.json();

    if(!data || data.error) throw new Error('Fiil gak ketemu');

    // 12 shighoh lengkap
    let tabel = `
      <h3>📖 تَصْرِيف: ${root}</h3>
      <table>
        <tr><th>الاصطلاح</th><th>الصيغة</th></tr>
        <tr><td>الماضي</td><td class="arab">${data.past || '-'}</td></tr>
        <tr><td>المضارع</td><td class="arab">${data.present || '-'}</td></tr>
        <tr><td>الأمر</td><td class="arab">${data.imperative || '-'}</td></tr>
        <tr><td>النهي</td><td class="arab">${data.prohibitive || '-'}</td></tr>
        <tr><td>المصدر</td><td class="arab">${data.masdar || '-'}</td></tr>
        <tr><td>اسم الفاعل</td><td class="arab">${data.active_participle || '-'}</td></tr>
        <tr><td>اسم المفعول</td><td class="arab">${data.passive_participle || '-'}</td></tr>
        <tr><td>صيغة المبالغة</td><td class="arab">${data.intensive || '-'}</td></tr>
        <tr><td>اسم التفضيل</td><td class="arab">${data.comparative || '-'}</td></tr>
        <tr><td>اسم الزمان</td><td class="arab">${data.time_noun || '-'}</td></tr>
        <tr><td>اسم المكان</td><td class="arab">${data.place_noun || '-'}</td></tr>
        <tr><td>اسم الآلة</td><td class="arab">${data.instrument_noun || '-'}</td></tr>
      </table>
      <small style="opacity:0.7">Sumber: Qutrub Arabeyes.org</small>
    `;
    hasilDiv.innerHTML = tabel;

  } catch(e) {
    console.error(e);
    hasilDiv.innerHTML = `<p style="color:red; text-align:center">❌ Error: ${e.message}. Coba fiil lain.</p>`;
  }
});
