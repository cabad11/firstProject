var Module;
(function (Module) {
    var ReactionsModule = /** @class */ (function () {
        /**
         * Create Module
         * @param config - Module parameters
         */
        function ReactionsModule(config) {
            this.selectNumber = localStorage.getItem("selected") === null ?
                undefined : +localStorage.getItem("selected");
            this.onContainerClick = this.onContainerClick.bind(this);
            this.RootElement = config.rootElement;
            this.Rendering = new Renderer(config, this.onContainerClick);
            this.storage = this.Rendering.storage;
            this.setValues();
        }
        /**
         * Work with Storage
         */
        ReactionsModule.prototype.onSelect = function () {
            if (this.previousNumber !== undefined) {
                var count_1 = this.storage.getItem(String(this.previousNumber)) === undefined ? 0
                    : +this.storage.getItem(String(this.previousNumber));
                this.storage.setItem(String(this.previousNumber), String(+count_1 - 1));
            }
            if (this.previousNumber === this.selectNumber) {
                return;
            }
            var count = this.storage.getItem(String(this.selectNumber)) === undefined ? 0
                : +this.storage.getItem(String(this.selectNumber));
            this.storage.setItem(String(this.selectNumber), String(count + 1));
        };
        /**
         * Use on click
         * @param {number} i number of clicked container
         */
        ReactionsModule.prototype.onContainerClick = function (i) {
            this.selectNumber = i;
            this.onSelect();
            this.setValues();
        };
        /**
         * Unselect element
         */
        ReactionsModule.prototype.selectElem = function () {
            var containers = this.Rendering.containers;
            containers[this.selectNumber].querySelector(".emoji").classList
                .add("selected");
            this.previousNumber = this.selectNumber;
            localStorage.setItem("selected", "" + this.selectNumber);
            containers[this.selectNumber].querySelector(".countText").textContent =
                this.storage.getItem(String(this.selectNumber));
        };
        /**
             * Set previous number and shows selected counter
             */
        ReactionsModule.prototype.setValues = function () {
            if (this.previousNumber !== undefined) {
                this.unSelectElem();
            }
            if (this.previousNumber === this.selectNumber) {
                this.previousNumber = undefined;
                localStorage.removeItem("selected");
                return;
            }
            this.selectElem();
        };
        /**
         * Select element
         */
        ReactionsModule.prototype.unSelectElem = function () {
            var containers = this.Rendering.containers;
            containers[this.previousNumber].querySelector(".emoji").classList
                .remove("selected");
            containers[this.previousNumber].querySelector(".countText").textContent =
                this.storage.getItem(String(this.previousNumber));
        };
        return ReactionsModule;
    }());
    Module.ReactionsModule = ReactionsModule;
})(Module || (Module = {}));
//# sourceMappingURL=module.js.map