namespace Module {
	type onSelectType = (x: number, d: number, c: HTMLElement[], storage: SmileStorage) => void;
	type newString = string & { codePointAt?(x: number): number };
	interface Iconfig {
		arrayEmoji: newString[];
		rootElement: HTMLElement;
		storage?: Storage | number[] | object;
		text: string;
		saveFunc?(key: string | number, value: string | number): void;
	}
	export class ReactionsModule {

		public rootElement: HTMLElement;
		private previousNumber: number | undefined;
		private Rendering: Renderer;
		private selectNumber: number | undefined = localStorage.getItem('selected') === null ?
			undefined : +localStorage.getItem('selected');
		private storage: SmileStorage ;
		/**
		 * Create Module
		 * @param config - Module parameters
		 */
		public constructor(config: Iconfig) {
			this.onContainerClick = this.onContainerClick.bind(this);
			this.rootElement = config.rootElement;
			this.Rendering = new Renderer(config, this.onContainerClick);
			this.storage = this.Rendering.storage;
			this.setValues();
		}
		/**
		 * Work with Storage
		 */
		public onSelect(): void {
			if (this.previousNumber !== undefined) {
				const count: number = this.storage.getItem(String(this.previousNumber)) === undefined ? 0
					: +this.storage.getItem(String(this.previousNumber));
				this.storage.setItem(String(this.previousNumber), String(+count - 1));
			}
			if (this.previousNumber === this.selectNumber) {
				return;
			}
			const count: number = this.storage.getItem(String(this.selectNumber)) === undefined ? 0
				: +this.storage.getItem(String(this.selectNumber));
			this.storage.setItem(String(this.selectNumber), String(count + 1));
		}
		/**
		 * Use on click
		 * @param {number} i number of clicked container
		 */
		private onContainerClick(i: number): void {
			this.selectNumber = i;
			this.onSelect();
			this.setValues();
		}
		/**
		 * Unselect element
		 */
		private selectElem(): void {
			this.previousNumber = this.selectNumber;
			localStorage.setItem('selected', `${this.selectNumber}`);

			const containers: HTMLElement[] = this.Rendering.containers;
			containers[this.selectNumber].querySelector('.emoji').classList
				.add('selected');
			containers[this.selectNumber].querySelector('.countText').textContent =
				this.storage.getItem(String(this.selectNumber));
		}
		/**
		 * Set previous number and shows selected counter
		 */
		private setValues(): void {

			if (this.previousNumber !== undefined) {
				this.unSelectElem();
			}

			if (this.previousNumber === this.selectNumber) {
				this.previousNumber = undefined;
				localStorage.removeItem('selected');
				return;
			}

			this.selectElem();

		}
		/**
		 * Select element
		 */
		private unSelectElem(): void {
			const containers: HTMLElement[] = this.Rendering.containers;

			containers[this.previousNumber].querySelector('.emoji').classList
				.remove('selected');

			containers[this.previousNumber].querySelector('.countText').textContent =
				this.storage.getItem(String(this.previousNumber));
		}
	}
}
