
// 本地数据存储

class StorageService {

    constructor() {
        this.storage = window.localStorage;
    }

    set(key, val) {
        this.storage.setItem(key, JSON.stringify(val));
    };

    get(key) {
        return JSON.parse(this.storage.getItem(key));
    };

    del(key) {
        this.storage.removeItem(key);
    }
};

const storage = new StorageService();