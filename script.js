const selectBab = document.getElementById('bab');
const selectHuruf = document.getElementById('huruf');
const selectFiil = document.getElementById('fiil');
const hasilDiv = document.getElementById('hasil');

// Isi dropdown huruf
selectBab.addEventListener('change', () => {
  selectHuruf.innerHTML = '<option value="">Pilih Huruf</option>';
  selectFiil.innerHTML = '<option value="">Pilih Fiil</option>';
  hasilDiv.innerHTML = '';

  let hurufList = Object.keys(dataBab[selectBab.value] || {});
  hurufList.forEach(h => {
    selectHuruf.innerHTML += `<option value="${h}">${h}</option>`;
  });
});

// Isi dropdown fiil
selectHuruf.addEventListener('change', () => {
  selectFiil.innerHTML = '<option value="">Pilih Fiil</option>';
  hasilDiv.innerHTML = '';

  let fiilList = dataBab[selectBab.value][selectHuruf.value] || [];
  fiilList.forEach(f => {
    selectFiil.innerHTML += `<option value='${JSON.stringify(f)}'>${f.madhi} - ${f.arti}</option>`;
  });
});

// Ambil data dari Qutrub + tampil elegan
async function tampilkanFiil() {
  let fiilData = JSON.parse(selectFiil.value);
  let madhi = fiilData.madhi;

  hasilDiv.innerHTML = '<p style="text-align:center">⏳ Mengambil data tasrif...</p>';

  try {
    // Pake CORS proxy biar gak keblok
    let url = `https://corsproxy.io/?https://qutrub.arabeyes.org/sarf.php?verb=${encodeURIComponent(madhi)}&bab=1&root=&tr=`;
    let res = await fetch(url);
    let html = await res.text();

    // Parsing HTML ambil tabel tasrif
    let parser = new DOMParser();
    let doc = parser.parseFromString(html, 'text/html');
    let tables = doc.querySelectorAll('table');

    // Tabel ke-2 biasanya tabel tasrif lengkap
    let tabelTasrif = tables[1];

    if(!tabelTasrif) throw new Error("Data gak ketemu");

    // Bungkus pake CSS elegan kita
    hasilDiv.innerHTML = `
      <h3>تَصْرِيف: ${madhi} - ${fiilData.arti}</h3>
      <div style="overflow-x:auto">
        ${tabelTasrif.outerHTML}
      </div>
    `;

  } catch(e) {
    hasilDiv.innerHTML = `<p style="color:red; text-align:center">❌ Gagal ambil data. Cek internet/proxy.</p>`;
    console.error(e);
  }
}
