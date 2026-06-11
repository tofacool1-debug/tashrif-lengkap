class DBHandler {
  static dbName = 'TasrifDB';
  static storeName = 'riwayat';
  static db = null;

  static async init() {
    if(this.db) return Promise.resolve();
    
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(this.dbName, 1);
      
      req.onupgradeneeded = e => {
        const db = e.target.result;
        if(!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName, {keyPath: 'id', autoIncrement: true});
        }
      };
      
      req.onsuccess = e => { 
        this.db = e.target.result; 
        resolve(); 
      };
      
      req.onerror = e => reject('Gagal buka DB: ' + e.target.error);
    });
  }

  static async simpan(data) {
    await this.init();
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(this.storeName, 'readwrite');
      const store = tx.objectStore(this.storeName);
      const req = store.add({...data, waktu: new Date().toLocaleString('id-ID')});
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  static async ambilSemua() {
    await this.init();
    return new Promise(resolve => {
      const tx = this.db.transaction(this.storeName, 'readonly');
      const req = tx.objectStore(this.storeName).getAll();
      req.onsuccess = () => resolve(req.result.reverse());
    });
  }

  static async hapusSemua() {
    await this.init();
    return new Promise(resolve => {
      const tx = this.db.transaction(this.storeName, 'readwrite');
      tx.objectStore(this.storeName).clear();
      tx.oncomplete = () => resolve();
    });
  }

  static async getCount() {
    await this.init();
    return new Promise(resolve => {
      const tx = this.db.transaction(this.storeName, 'readonly');
      const req = tx.objectStore(this.storeName).count();
      req.onsuccess = () => resolve(req.result);
    });
  }
}

export default DBHandler;