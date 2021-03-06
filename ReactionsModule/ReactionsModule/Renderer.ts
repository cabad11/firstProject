 type onSelectType = (x: number, d: number, c: HTMLElement[], storage: SmileStorage) => void;
 type newString = string & { codePointAt?(x: number): number };
 interface Iconfig {
	arrayEmoji: newString[];
	rootElement: HTMLElement;
	storage?: Storage | number[] | object;
	text: string;
	saveFunc?(key: string | number, value: string | number): void;
}
 class Renderer {
	public containers: HTMLElement[] = [];
	public storage: SmileStorage = new SmileStorage(localStorage);
	private _holder: HTMLElement;
	/**
 * Create elements for module
 * @param {Iconfig} config - Module parameters
 * @param {function} onContainerClick - use on container click
 */
	public constructor(private config: Iconfig, private onContainerClick: (i: number) => void) {
		if (config.storage) { this.storage = new SmileStorage(config.storage, config.saveFunc); }
		this._holder = this.CreateHolder();
		this.CreateText();
		this.CreateCounters()// Create array of containers
			.forEach((elem: HTMLElement) => this._holder.appendChild(elem));  // Insert containers into filler
		config.rootElement.appendChild(this._holder);
	}
	/**
	 * Create counter container
	 * @param {number} i - number of container
	 */
	private CreateContainer(i: number): HTMLElement {
		const container: HTMLElement = this.createElement("div", "container");

		container.addEventListener("click", ((e: MouseEvent): void => {
			this.onContainerClick(i);
		}).bind(this));
		return container;
	}
	/**
	 * Create array of counters
	 */
	private CreateCounters(): HTMLElement[] {
		this.config.arrayEmoji.forEach((item: string, i: number) => {
			const MAX_EMOT_LENGTH: number = 2;
			if (item.length > MAX_EMOT_LENGTH) { return; }
			const container: HTMLElement = this.CreateContainer(i);

			const emoji: HTMLElement = this.CreateEmoji(i, item);

			const count: HTMLElement = this.CreateCountText(i);

			this.containers.push(container);
			container.appendChild(emoji);
			container.appendChild(count);
		});
		return this.containers;
	}
	/**
	 * Create elem which show counter
	 * @param i i - number of container
	 */
	private CreateCountText(i: number): HTMLElement {
		let count: string = this.storage.getItem(String(i)) === undefined ? "0" : this.storage.getItem(String(i));
		let elem: HTMLElement = this.createElement("div", "countText", count);
		return elem;
	}
	/**
	 * Create a element
	 * @param {string} tag - tag of element
	 * @param {string} useClass - class of element
	 * @param {string} text? - text in element
	 * @returns
	 */
	private createElement(tag: string, useClass: string, text?: string): HTMLElement {
		let elem: HTMLElement = document.createElement(tag);
		if (text !== undefined) { elem.textContent = text; }
		elem.classList.add(useClass);
		return elem;
	}
	/**
	 * Create elem with emotion
	 * @param {number} i - Number of container
	 * @param {string} emot - Emotion symbol
	 */
	private CreateEmoji(i: number, emot: newString): HTMLElement {
		const wrapper: HTMLElement = this.createElement("div", "emoji");
		const emoji: HTMLImageElement = new Image();
		emoji.classList.add("emojiImg");
		const code: string = (emot.codePointAt(0)).toString(16);
		emoji.src = `https://badoocdn.com/big/chat/emoji@x2/${code}.png`;
		wrapper.appendChild(emoji);
		return wrapper;
	}
	/**
	 * Create main element
	 */
	private CreateHolder(): HTMLElement {
		const filler: HTMLElement = this.createElement("div", "holder");
		return filler;
	}
	/**
	 * Create Text element and insert it
	 */
	private CreateText(): void {
		const span: HTMLElement = this.createElement("span", "mainText", this.config.text);
		this._holder.appendChild(span);
	}

}
