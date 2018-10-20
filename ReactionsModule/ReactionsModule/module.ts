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
	interface Iconfig {
		arrayEmoji: Array<string & { codePointAt?(x: number): number }>;
		Storage?: Storage | Array<number> | object;
		RootElement: HTMLElement;
		text: string;
		saveFunc?: (key: string | number, value: string | number) => void;
	}
	class SmileStorage {
		constructor(private Storage: Storage | Array<number> | object, saveFunc?: (key: string | number, value: string | number) => void) {
			if (saveFunc !== undefined) this.setItem = saveFunc;
		}
		public getItem(key: string | number): string {
			if ("getItem" in Storage) var result: string = (<Storage>this.Storage).getItem(`${key}`);
			else result = this.Storage[key];
			if (result === null) result = undefined;
			return result
		}
		public setItem(key: string | number, value: string | number) {
			if ("setItem" in Storage) (<Storage>this.Storage).setItem(`${key}`, String(value));
			else this.Storage[key] = String(value);
		}
	}
	export class ReactionsModule {
		public set Text(value: string) {
			if (typeof (value) === "string") { this._text.textContent = value; } else { console.log("данные некорректны"); }
		}
		public RootElement: HTMLElement;
		public selectNumber: number | undefined = localStorage.getItem("selected") === undefined ?
			Infinity : +localStorage.getItem("selected");
		private _filler: HTMLElement;
		private _text: HTMLElement = document.createElement("span");
		private containers: container[] = [];
		private Storage: SmileStorage = new SmileStorage(localStorage);
		private previousNumber: number | undefined;
		public constructor(config: Iconfig) {
			if (config.Storage) { this.Storage = new SmileStorage(config.Storage, config.saveFunc); }
			this.RootElement = config.RootElement;
			this._filler = document.createElement("div");
			this._filler.style.cssText = EMOJI_FILLER_STYLE;
			this._text = document.createElement("span");
			this._text.style.cssText = INNERSPAN_STYLE;
			if (config.text) { this.Text = config.text; }
			if (config.arrayEmoji) {
				for (let i: number = 0; i < config.arrayEmoji.length; i++) {
					const emot: string & { codePointAt?(x: number): number  } = config.arrayEmoji[i];
					if (emot.length < 3) {
						const container: container = document.createElement("div");
						this.containers.push(container);
						container.style.cssText = EMOJI_CONTAINER_STYLE;
						if (i === this.selectNumber) {
							container.style.backgroundColor = "pink";
							this.previousNumber = this.selectNumber;
						}
						if (this.Storage.getItem(String(i)) === null) { this.Storage.setItem(String(i), "0"); }
						container.addEventListener("click", function(e: MouseEvent): void {
							this.selectNumber = i;
							this.onSelect(this.selectNumber, this.previousNumber, this.containers, this.Storage);
							if (this.previousNumber !== undefined) { this.containers[this.previousNumber].style.backgroundColor = ""; }
							if (this.previousNumber === this.selectNumber) {
								this.previousNumber = undefined;
								localStorage.setItem("selected", "undefiend");
							} else {
								this.containers[this.selectNumber].style.backgroundColor = "pink";
								this.previousNumber = this.selectNumber;
								localStorage.setItem("selected", this.selectNumber);
							}
						}.bind(this));
						const emoji: HTMLElement = document.createElement("div");
						emoji.textContent = this.Storage.getItem(String(i));
						emoji.style.cssText = EMOJI_STYLE;
						const code: string = (emot.codePointAt(0)).toString(16);
						emoji.style.backgroundImage = `url(https://badoocdn.com/big/chat/emoji@x2/${code}.png)`;
						container.appendChild(emoji);
						this._filler.appendChild(container);
					} else { throw new Error("длина смайла =" + emot.length); }
				}
			}
			this._filler.appendChild(this._text);
			config.RootElement.appendChild(this._filler);
		}
		public onSelect: (x: number, d: number, c: container[], storage: SmileStorage) => void
			= function (selectNum: number, previousNumber: number, containers: container[], storage: SmileStorage): void {
				console.log(storage);
			if (previousNumber !== undefined) {
				storage.setItem(String(previousNumber), String(+storage.getItem(String(previousNumber)) - 1));
				containers[previousNumber].children[0].textContent = storage.getItem(String(previousNumber));
			}
			if (previousNumber === selectNum) {
				previousNumber = undefined;
				return;
			}

				this.Storage.setItem(String(selectNum), String(+this.Storage.getItem(String(selectNum)) + 1));
				containers[selectNum].children[0].textContent = this.Storage.getItem(String(selectNum));
		};
	}
}
