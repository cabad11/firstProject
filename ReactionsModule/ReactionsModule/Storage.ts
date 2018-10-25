 class SmileStorage {

	/**
		*Create Storage
		*@param {object} Storage -Using storage
		*@param {function} saveFunc - custom function on save counter
		*/
	public constructor(private Storage: Storage | number[] | object,
		saveFunc?: (key: string | number, value: string | number) => void) {
		if (saveFunc !== undefined) { this.setItem = saveFunc; }
	}
	/**
	 * Get value by key
	 * @param {string | number} key - key of storage
	 */
	public getItem(key: string | number): string {
		let result: string = "getItem" in Storage ? (this.Storage as Storage).getItem(`${key}`) : this.Storage[key];
		if (result === null) { result = undefined; }
		return result;
	}
	/**
	 * Set value by key
	 * @param key - key of storage
	 * @param value - setting value
	 */
	public setItem(key: string | number, value: string | number): void {
		if ("setItem" in Storage) { (this.Storage as Storage).setItem(`${key}`, String(value)); }
		else { this.Storage[key] = String(value); }
	}
}
