import OtakManager from './otak_manager.js';
import DBHandler from './db_handler.js';

class InputHandler {
  static async batchInput(dataArray) {
    const hasil = [];
    
    for(let item of dataArray) {
      try {
        const data = OtakManager.tasrif(item.asal, item.bab || 1);
        hasil.push({status: 'sukses', ...data});
        // Simpan ke IndexedDB, bukan localStorage
        await DBHandler.simpan({asal: item.asal, bab: item.bab, hasil: data});
      } catch(e) {
        hasil.push({status: 'error', asal: item.asal, pesan: e.message});
      }
    }
    
    return hasil;
  }

  static async exportJSON() {
    const data = await DBHandler.ambilSemua();
    const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tasrif_db_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  static importJSON(file, callback) {
    const reader = new FileReader();
    reader.onload = async e => {
      try {
        const data = JSON.parse(e.target.result);
        const hasil = await this.batchInput(data);
        callback(hasil);
      } catch(err) {
        alert('File JSON rusak: ' + err.message);
      }
    };
    reader.readAsText(file);
  }

  static async getJumlahData() {
    return await DBHandler.getCount();
  }
}

export default InputHandler;