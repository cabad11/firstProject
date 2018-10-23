namespace Module {
	const EMOJI_FILLER_STYLE: string = `
	background-color:grey;
	width:100%;
	height: 100%;
	display:flex;
	justify-content:center;
	flex-wrap:wrap;
	align-items:center;
	`;
	const EMOJI_CONTAINER_STYLE: string = `
	height:100%;
	flex:1 1 auto;
	display:flex;
	align-items:stretch`;
	const EMOJI_STYLE: string = `
	flex:1 1 auto;
	background:  no-repeat;
	background-size: cover 100% 100%;
	backround-origin:content-box;
	background-size:contain;
	border:1px solid`;
	const INNERSPAN_STYLE: string = `
	order:-1;
	margin:5%;
	font-size:4ex;`;
	type container = HTMLElement & { smileNumber?: number };
	type onSelectType = (x: number, d: number, c: container[], storage: SmileStorage) => void;
	type newString = string & { codePointAt?(x: number): number };
	interface Iconfig {
		arrayEmoji: newString[];
		RootElement: HTMLElement;
		Storage?: Storage | number[] | object;
		text: string;
		saveFunc?(key: string | number, value: string | number): void;
	}
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
			if ("getItem" in Storage) { var result: string = (this.Storage as Storage).getItem(`${key}`); }
			else { result = this.Storage[key]; }
			if (result === null) { result = "undefined"; }
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
	class Render {
		public containers: container[] = [];
		private _holder: HTMLElement;

		private Storage: SmileStorage = new SmileStorage(localStorage);
		/**
			 * Create elements for module
			 * @param {Iconfig} config - Module parameters
			 * @param {function} onContainerClick - use on container click
			 */
		public constructor(config: Iconfig, onContainerClick: (i: number) => void) {
			if (config.Storage) { this.Storage = new SmileStorage(config.Storage, config.saveFunc); }
			this._holder = this.CreateHolder();
			this.CreateText(config.text);
			this.CreateCounters(config, onContainerClick)// Create array of containers
				.forEach((elem: HTMLElement) => this._holder.appendChild(elem));  // Insert containers into filler
			config.RootElement.appendChild(this._holder);
		}
		/**
		 * Create counter container
		 * @param {number} i - number of container
		 * @param {Function} onContainerClick - use on click
		 */
		private CreateContainer(i: number, onContainerClick: (i: number) => void): HTMLElement {
			const container: container = document.createElement("div");
			container.style.cssText = EMOJI_CONTAINER_STYLE;

			container.addEventListener("click", function(e: MouseEvent): void {
				onContainerClick(i);
			}.bind(this));
			return container;
		}
		private CreateCounters(config: Iconfig, onContainerClick: (i: number) => void): container[] {

			for (let i: number = 0; i < config.arrayEmoji.length; i++) {
				const emot: newString = config.arrayEmoji[i];
				const MAX_EMOT_LENGTH: number = 3;
				if (emot.length < MAX_EMOT_LENGTH) {
					const container: container = this.CreateContainer(i, onContainerClick);

					const emoji: HTMLElement = this.CreateEmoji(i, emot);
					this.containers.push(container);
					container.appendChild(emoji);
					}
			}
			return this.containers;
		}
		/**
		 * Create elem with emotion
		 * @param {number} i - Number of container
		 * @param {string} emot - Emotion symbol
		 */
		private CreateEmoji(i: number, emot: newString): HTMLElement {
			const emoji: HTMLElement = document.createElement("div");
			let count: string = this.Storage.getItem(String(i)) === undefined ? "0" : this.Storage.getItem(String(i));
			emoji.textContent = count;
			emoji.style.cssText = EMOJI_STYLE;
			const code: string = (emot.codePointAt(0)).toString(16);
			emoji.style.backgroundImage = `url(https://badoocdn.com/big/chat/emoji@x2/${code}.png)`;
			return emoji;
		}
		/**
		 * Create main element
		 */
		private CreateHolder(): HTMLElement {
			const filler: HTMLElement = document.createElement("div");
			filler.style.cssText = EMOJI_FILLER_STYLE;
			return filler;
		}
		/**
		 * Create Text element and insert it
		 * @param {string} text - Needed text
		 */
		private CreateText(text: string): void {
			const span: HTMLElement = document.createElement("span");
			span.style.cssText = INNERSPAN_STYLE;
			if (text) {
			span.textContent = text;
		}
			this._holder.appendChild(span);
		}

	}
	export class ReactionsModule {

		public RootElement: HTMLElement;
		private previousNumber: number | undefined;
		private Rendering: Render;
		private selectNumber: number | undefined = localStorage.getItem("selected") === null ?
			Infinity : +localStorage.getItem("selected");
		private Storage: SmileStorage = new SmileStorage(localStorage);
		/**
		 * Create Module
		 * @param config - Module parameters
		 */
		public constructor(config: Iconfig) {
			this.onContainerClick = this.onContainerClick.bind(this);
			this.RootElement = config.RootElement;
			if (config.Storage) { this.Storage = new SmileStorage(config.Storage, config.saveFunc); }
			this.Rendering = new Render(config, this.onContainerClick);
			this.setValues();
		}
			/**
			 * Work with Storage
			 * @param {number} selectNum
			 * @param {number} previousNumber
			 * @param {container[]} containers
			 * @param {SmileStorage} storage
			 */
		public onSelect(selectNum: number, previousNumber: number, containers: container[], storage: SmileStorage): void {
			if (previousNumber !== undefined) {
				let count: number = this.Storage.getItem(String(previousNumber)) === undefined ? 0
					: +this.Storage.getItem(String(previousNumber));
				storage.setItem(String(previousNumber), String(+count - 1));
				containers[previousNumber].children[0].textContent = storage.getItem(String(previousNumber));
			}
			if (previousNumber === selectNum) {
				return;
			}
			let count: number = this.Storage.getItem(String(selectNum)) === undefined ? 0
				: +this.Storage.getItem(String(selectNum));
			storage.setItem(String(selectNum), String(count + 1));
			containers[selectNum].children[0].textContent = storage.getItem(String(selectNum));
		}
		/**
		 * Use on click
		 * @param {number} i number of clicked container
		 */
		private onContainerClick(i: number): void {
			this.selectNumber = i;
			this.onSelect(this.selectNumber, this.previousNumber, this.Rendering.containers, this.Storage);
			this.setValues();
		}
		/**
			 * Set previous number and shows selected counter
			 */
		private setValues(): void {
			if (this.previousNumber !== undefined) {
				this.Rendering.containers[this.previousNumber].style.backgroundColor = "";
			}
			if (this.previousNumber === this.selectNumber) {
				this.previousNumber = undefined;
				localStorage.setItem("selected", "undefiend");
			}
			else {
				this.Rendering.containers[this.selectNumber].style.backgroundColor = "pink";
				this.previousNumber = this.selectNumber;
				localStorage.setItem("selected", `${this.selectNumber}`);
			}
		}
	}
}
