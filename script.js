const selectBab = document.getElementById('bab');
const selectHuruf = document.getElementById('huruf');
const selectFiil = document.getElementById('fiil');
const hasilDiv = document.getElementById('hasil');
const btnTampil = document.getElementById('btnTampil');

// 1. Isi dropdown huruf pas bab dipilih
selectBab.addEventListener('change', () => {
  selectHuruf.innerHTML = '<option value="">Pilih Huruf</option>';
  selectFiil.innerHTML = '<option value="">Pilih Fiil</option>';
  hasilDiv.innerHTML = '';

  let hurufList = Object.keys(dataBab[selectBab.value] || {});
  hurufList.forEach(h => {
    selectHuruf.innerHTML += `<option value="${h}">${h}</option>`;
  });
});

// 2. Isi dropdown fiil pas huruf dipilih
selectHuruf.addEventListener('change', () => {
  selectFiil.innerHTML = '<option value="">Pilih Fiil Madhi</option>';
  hasilDiv.innerHTML = '';

  let fiilList = dataBab[selectBab.value][selectHuruf.value] || [];
  fiilList.forEach(f => {
    selectFiil.innerHTML += `<option value="${f.madhi}">${f.madhi} - ${f.arti}</option>`;
  });
});

// 3. Fungsi utama: ambil tasrif dari sarf.c4a8.com
btnTampil.addEventListener('click', async () => {
  let madhi = selectFiil.value;
  if(!madhi) {
    alert('Pilih fiil dulu bang!');
    return;
  }

  // Ambil root 3 huruf dari madhi, contoh: كتب
  let root = madhi.replace(/[ًٌٍَُِّْ]/g, '');
  hasilDiv.innerHTML = '<p style="text-align:center">⏳ Mengambil data tasrif...</p>';

  try {
    let res = await fetch(`https://sarf.c4a8.com/api/?root=${encodeURIComponent(root)}`);
    if(!res.ok) throw new Error('API error');
    let data = await res.json();

    // Ambil semua shighoh, kasih fallback "-" kalo kosong
    let tasrif = {
      'الماضي': data.madi?.[0] || madhi,
      'المضارع': data.mudari?.[0] || '-',
      'الأمر': data.amr?.[0] || '-',
      'النهي': data.nahi?.[0] || '-',
      'المصدر': data.masdar?.[0] || '-',
      'اسم الفاعل': data.isem_fael?.[0] || '-',
      'اسم المفعول': data.isem_mafoul?.[0] || '-',
      'صيغة المبالغة': data.sighat_mubalaghah?.[0] || '-',
      'اسم التفضيل': data.isem_tafdheel?.[0] || '-',
      'اسم الزمان': data.isem_zaman?.[0] || '-',
      'اسم المكان': data.isem_makan?.[0] || '-',
      'اسم الآلة': data.isem_alah?.[0] || '-'
    };

    // Tampilkan pake CSS elegan
    let html = `<h3>📖 تَصْرِيف: ${madhi} - ${selectFiil.options[selectFiil.selectedIndex].text.split(' - ')[1]}</h3>`;
    html += `<table>`;
    html += `<tr><th>الاصطلاح</th><th>الصيغة</th></tr>`;

    for(let key in tasrif) {
      html += `<tr><td>${key}</td><td class="arab">${tasrif[key]}</td></tr>`;
    }
    html += `</table>`;
    html += `<small style="opacity:0.7">Sumber: sarf.c4a8.com</small>`;

    hasilDiv.innerHTML = html;

  } catch(e) {
    console.error(e);
    hasilDiv.innerHTML = `<p style="color:red; text-align:center">❌ Gagal ambil data. Cek internet / kata dasarnya.</p>`;
  }
});
