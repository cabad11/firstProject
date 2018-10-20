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
		public constructor(private Storage: Storage | number[] | object,
			saveFunc?: (key: string | number, value: string | number) => void) {
			if (saveFunc !== undefined) { this.setItem = saveFunc; }
		}
		public getItem(key: string | number): string {
			if ("getItem" in Storage) { var result: string = (this.Storage as Storage).getItem(`${key}`); }
			else { result = this.Storage[key]; }
			if (result === null) { result = undefined; }
			return result;
		}
		public setItem(key: string | number, value: string | number): void {
			if ("setItem" in Storage) { (this.Storage as Storage).setItem(`${key}`, String(value)); }
			else { this.Storage[key] = String(value); }
		}
	}
	namespace Render {
		let selectNumber: number | undefined = localStorage.getItem("selected") === null ?
			Infinity : +localStorage.getItem("selected");
		export function render(config: Iconfig, onSelect: onSelectType): void {
			if (config.Storage) { Storage = new SmileStorage(config.Storage, config.saveFunc); }
			_filler = CreateFiller();
			CreateText(config.text);
			CreateCounters(config, onSelect)
				.forEach((elem: HTMLElement) => _filler.appendChild(elem));  // Insert containers into filler
			config.RootElement.appendChild(_filler);
		}
		let _filler: HTMLElement;
		let previousNumber: number | undefined;
		let Storage: SmileStorage = new SmileStorage(localStorage);
		function CreateCounters(config: Iconfig, onSelect: onSelectType): container[] {
			const containers: container[] = [];
			for (let i: number = 0; i < config.arrayEmoji.length; i++) {
				const emot: string & { codePointAt?(x: number): number; } = config.arrayEmoji[i];
				const MAX_EMOT_LENGTH: number = 3;
				if (emot.length < MAX_EMOT_LENGTH) {
						const container: container = CreateContainer(i);

						const emoji: HTMLElement = CreateEmoji(i, emot);
						container.addEventListener("click", function(e: MouseEvent): void {
							onContainerClick(i, onSelect, containers);
						}.bind(this));
						containers.push(container);
						container.appendChild(emoji);
					}
			}
			return containers;
		}
		function CreateEmoji(i: number, emot: newString): HTMLElement {
			const emoji: HTMLElement = document.createElement("div");
			emoji.textContent = Storage.getItem(String(i));
			emoji.style.cssText = EMOJI_STYLE;
			const code: string = (emot.codePointAt(0)).toString(16);
			emoji.style.backgroundImage = `url(https://badoocdn.com/big/chat/emoji@x2/${code}.png)`;
			return emoji;
		}

		function CreateContainer(i: number): HTMLElement {
			const container: container = document.createElement("div");
			container.style.cssText = EMOJI_CONTAINER_STYLE;
			if (i === selectNumber) {
				container.style.backgroundColor = "pink";
				previousNumber = selectNumber;
			}
			if (Storage.getItem(String(i)) === undefined) {
				Storage.setItem(String(i), "0");
			}
			return container;
		}

		function CreateFiller(): HTMLElement {
			const filler: HTMLElement = document.createElement("div");
		 filler.style.cssText = EMOJI_FILLER_STYLE;
		 return filler;
		}

		function onContainerClick(i: number, onSelect: onSelectType,
			containers: container[]): void {
			selectNumber = i;
			onSelect(selectNumber, previousNumber, containers, Storage);
			if (previousNumber !== undefined) {
				containers[previousNumber].style.backgroundColor = "";
			}
			if (previousNumber === selectNumber) {
				previousNumber = undefined;
				localStorage.setItem("selected", "undefiend");
			} else {
				containers[selectNumber].style.backgroundColor = "pink";
				previousNumber = selectNumber;
				localStorage.setItem("selected", `${selectNumber}`);
			}
		}
		// Create Text element and insert it
		function CreateText(text: string): void {
			const span: HTMLElement = document.createElement("span");
		 span.style.cssText = INNERSPAN_STYLE;
		 if (text) {
			span.textContent = text;
		}
		 _filler.appendChild(span);
		}
	}
	export class ReactionsModule {
		public RootElement: HTMLElement;
		public constructor(config: Iconfig) {
			this.RootElement = config.RootElement;
			Render.render(config, this.onSelect);
		}
		// Work with storage
		public onSelect: onSelectType =
			function(selectNum: number, previousNumber: number, containers: container[], storage: SmileStorage): void {
			 if (previousNumber !== undefined) {
				storage.setItem(String(previousNumber), String(+storage.getItem(String(previousNumber)) - 1));
				containers[previousNumber].children[0].textContent = storage.getItem(String(previousNumber));
			}
			 if (previousNumber === selectNum) {
				return;
			}
				storage.setItem(String(selectNum), String(+storage.getItem(String(selectNum)) + 1));
				containers[selectNum].children[0].textContent = storage.getItem(String(selectNum));
		};

	}
}
