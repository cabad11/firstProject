namespace Module {
	const EMOJI_FILLER_STYLE = `
	background-color:grey;	
	width:100%;
	height: 100%;
	display:flex;
	justify-content:center;
	flex-wrap:wrap;
	align-items:center;
	`;
	const EMOJI_CONTAINER_STYLE = `
	height:100%;
	flex:1 1 auto;
	display:flex;
	align-items:stretch`;
	const EMOJI_STYLE = `
	flex:1 1 auto;
	background:  no-repeat;
	background-size: cover 100% 100%;
	backround-origin:content-box;
	background-size:contain;
	border:1px solid`;
	const INNERSPAN_STYLE = `
	order:-1;
	margin:5%;
	font-size:4ex;`;
	type container = HTMLElement & { smileNumber?: number };
	export class ReactionsModule {
		private _filler: HTMLElement;
		private _innerspan: HTMLElement = document.createElement("span");
		private selectedElem: HTMLElement | undefined;
		private previousNumber: number | undefined;
		private containers: Array<container>=[];
		public selectNumber: number | undefined = localStorage.getItem("selected") === undefined || localStorage.getItem("selected") === null ? Infinity: +localStorage.getItem("selected");
		public set Text(value: string) {		
			if (typeof (value) == "string") this._innerspan.textContent = value;
			else console.log("данные некорректны");
		}
		public onSelect: (x: number, c: Array<container>, d: number) => void = function (selectNum: number, containers: Array<container>, previousNumber: number): void {
			

			if (previousNumber !== undefined) {
				this.obj.setItem(String(previousNumber), String(+this.obj.getItem(String(previousNumber)) - 1));
				containers[previousNumber].children[0].textContent = this.obj.getItem(String(previousNumber));
			}
			if (previousNumber === selectNum) {
				previousNumber = undefined;
				return;
			}
			previousNumber = selectNum;
			this.obj.setItem(String(selectNum), String(+this.obj.getItem(String(selectNum)) + 1));
			containers[selectNum].children[0].textContent = this.obj.getItem(String(selectNum));	
		};
		constructor(public element: HTMLElement, text: string, arrayEmoji: any[], private obj: Storage = localStorage) {
			this._filler = document.createElement("div");
			this._filler.style.cssText = EMOJI_FILLER_STYLE;
			this._innerspan = document.createElement("span");
			this._innerspan.style.cssText = INNERSPAN_STYLE;
			if (text) this.Text = text;	
			if (arrayEmoji)
				for (let i = 0; i<arrayEmoji.length; i++) {
					var emot: any = arrayEmoji[i];
					if (emot.length < 3) {
						let container: container = document.createElement("div");
						this.containers.push(container);
						container.style.cssText = EMOJI_CONTAINER_STYLE;
						if (i === this.selectNumber) {	
							container.style.backgroundColor = "pink";
							this.selectedElem = container;
							this.previousNumber = this.selectNumber;
						};
						if (obj.getItem(String(i)) === null) obj.setItem(String(i), "0");
						container.addEventListener("click", function (e: MouseEvent): void {
							this.selectNumber =i;
							if (this.selectedElem) this.selectedElem.style.backgroundColor = "";
							this.selectedElem = (<HTMLElement>e.target);
							this.onSelect(this.selectNumber, this.containers,this.previousNumber);
							if (this.previousNumber === this.selectNumber) {
								this.previousNumber = undefined;
								this.selectedElem.style.backgroundColor = "	";
								localStorage.setItem("selected", "undefiend");
							}
							else {
								this.selectedElem.style.backgroundColor = "pink";
								this.previousNumber = this.selectNumber;
								localStorage.setItem("selected", this.selectNumber);
							}
						}.bind(this))
						var emoji: HTMLElement = document.createElement("div");
						emoji.textContent = obj.getItem(String(i));
						emoji.style.cssText = EMOJI_STYLE;
						var code: string = (emot.codePointAt(0)).toString(16);
						emoji.style.backgroundImage = `url(https://badoocdn.com/big/chat/emoji@x2/${code}.png)`;
						container.appendChild(emoji);
						this._filler.appendChild(container);
					}	
					else console.log("длина смайла =" + emot.length);
				}
			this._filler.appendChild(this._innerspan);
			element.appendChild(this._filler);
		};
	}
}