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
