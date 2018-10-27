var SmileStorage = /** @class */ (function () {
    /**
     * Create Storage
     * @param {object} Storage -Using storage
     * @param {function} saveFunc - custom function on save counter
     */
    function SmileStorage(Storage, saveFunc) {
        this.Storage = Storage;
        if (saveFunc !== undefined) {
            this.setItem = saveFunc;
        }
    }
    /**
     * Get value by key
     * @param {string | number} key - key of storage
     */
    SmileStorage.prototype.getItem = function (key) {
        var result = 'getItem' in Storage ? this.Storage.getItem("" + key) : this.Storage[key];
        if (result === null) {
            result = undefined;
        }
        return result;
    };
    /**
     * Set value by key
     * @param key - key of storage
     * @param value - setting value
     */
    SmileStorage.prototype.setItem = function (key, value) {
        if ('setItem' in Storage) {
            this.Storage.setItem("" + key, String(value));
        }
        else {
            this.Storage[key] = String(value);
        }
    };
    return SmileStorage;
}());
//# sourceMappingURL=storage.js.map