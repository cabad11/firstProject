var Module;
(function (Module) {
    var EMOJI_FILLER_STYLE = "\n\twidth:100%;\n\theight: 100%;\n\tdisplay:flex;\n\tjustify-content:center;\n\tflex-wrap:wrap;\n\talign-items:center;\n\t";
    var EMOJI_CONTAINER_STYLE = "\n\theight:100%;\n\tflex:1 1 auto;\n\tdisplay:flex;\n\talign-items:stretch;";
    var EMOJI_STYLE = "\n\tflex:1 1 auto;\n\tbackground:  no-repeat;\n\tbackground-size: cover 100% 100%;\n\tbackround-origin:content-box;\n\tbackground-size:contain;\n\t";
    var INNERSPAN_STYLE = "\n\torder:-1;\n\tmargin:5%;\n\tfont-size:4ex;";
    var TEXT_COUNT_STYLE = "\n\theight:100%;\n\tflex:0 1 auto;\n\t";
    var SmileStorage = /** @class */ (function () {
        /**
            *Create Storage
            *@param {object} Storage -Using storage
            *@param {function} saveFunc - custom function on save counter
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
            if ("getItem" in Storage) {
                var result = this.Storage.getItem("" + key);
            }
            else {
                result = this.Storage[key];
            }
            if (result === null) {
                result = "undefined";
            }
            return result;
        };
        /**
         * Set value by key
         * @param key - key of storage
         * @param value - setting value
         */
        SmileStorage.prototype.setItem = function (key, value) {
            if ("setItem" in Storage) {
                this.Storage.setItem("" + key, String(value));
            }
            else {
                this.Storage[key] = String(value);
            }
        };
        return SmileStorage;
    }());
    var Renderer = /** @class */ (function () {
        /**
             * Create elements for module
             * @param {Iconfig} config - Module parameters
             * @param {function} onContainerClick - use on container click
             */
        function Renderer(config, onContainerClick) {
            var _this = this;
            this.containers = [];
            this.Storage = new SmileStorage(localStorage);
            if (config.Storage) {
                this.Storage = new SmileStorage(config.Storage, config.saveFunc);
            }
            this._holder = this.CreateHolder();
            this.CreateText(config.text);
            this.CreateCounters(config, onContainerClick) // Create array of containers
                .forEach(function (elem) { return _this._holder.appendChild(elem); }); // Insert containers into filler
            config.RootElement.appendChild(this._holder);
        }
        /**
         * Create counter container
         * @param {number} i - number of container
         * @param {Function} onContainerClick - use on click
         */
        Renderer.prototype.CreateContainer = function (i, onContainerClick) {
            var container = document.createElement("div");
            container.style.cssText = EMOJI_CONTAINER_STYLE;
            container.addEventListener("click", function (e) {
                onContainerClick(i);
            }.bind(this));
            return container;
        };
        /**
         * Create array of counters
         * @param config- Module parameters
         * @param onContainerClick- use on click
         */
        Renderer.prototype.CreateCounters = function (config, onContainerClick) {
            for (var i = 0; i < config.arrayEmoji.length; i++) {
                var emot = config.arrayEmoji[i];
                var MAX_EMOT_LENGTH = 3;
                if (emot.length < MAX_EMOT_LENGTH) {
                    var container = this.CreateContainer(i, onContainerClick);
                    var emoji = this.CreateEmoji(i, emot);
                    var count = this.CreateCountText(i);
                    this.containers.push(container);
                    container.appendChild(emoji);
                    container.appendChild(count);
                }
            }
            return this.containers;
        };
        /**
         * Create elem which show counter
         * @param i i - number of container
         */
        Renderer.prototype.CreateCountText = function (i) {
            var elem = document.createElement("div");
            var count = this.Storage.getItem(String(i)) === undefined ? "0" : this.Storage.getItem(String(i));
            elem.textContent = count;
            elem.style.cssText = TEXT_COUNT_STYLE;
            return elem;
        };
        /**
         * Create elem with emotion
         * @param {number} i - Number of container
         * @param {string} emot - Emotion symbol
         */
        Renderer.prototype.CreateEmoji = function (i, emot) {
            var emoji = document.createElement("div");
            emoji.style.cssText = EMOJI_STYLE;
            var code = (emot.codePointAt(0)).toString(16);
            emoji.style.backgroundImage = "url(https://badoocdn.com/big/chat/emoji@x2/" + code + ".png)";
            return emoji;
        };
        /**
         * Create main element
         */
        Renderer.prototype.CreateHolder = function () {
            var filler = document.createElement("div");
            filler.style.cssText = EMOJI_FILLER_STYLE;
            return filler;
        };
        /**
         * Create Text element and insert it
         * @param {string} text - Needed text
         */
        Renderer.prototype.CreateText = function (text) {
            var span = document.createElement("span");
            span.style.cssText = INNERSPAN_STYLE;
            if (text) {
                span.textContent = text;
            }
            this._holder.appendChild(span);
        };
        return Renderer;
    }());
    var ReactionsModule = /** @class */ (function () {
        /**
         * Create Module
         * @param config - Module parameters
         */
        function ReactionsModule(config) {
            this.selectNumber = localStorage.getItem("selected") === null ?
                Infinity : +localStorage.getItem("selected");
            this.Storage = new SmileStorage(localStorage);
            this.onContainerClick = this.onContainerClick.bind(this);
            this.RootElement = config.RootElement;
            if (config.Storage) {
                this.Storage = new SmileStorage(config.Storage, config.saveFunc);
            }
            this.Rendering = new Renderer(config, this.onContainerClick);
            this.setValues();
        }
        /**
         * Work with Storage
         * @param {number} selectNum
         * @param {number} previousNumber
         * @param {container[]} containers
         * @param {SmileStorage} storage
         */
        ReactionsModule.prototype.onSelect = function (selectNum, previousNumber, containers, storage) {
            if (!(this.previousNumber === undefined || this.previousNumber === NaN)) {
                var count_1 = this.Storage.getItem(String(previousNumber)) === undefined ? 0
                    : +this.Storage.getItem(String(previousNumber));
                storage.setItem(String(previousNumber), String(+count_1 - 1));
            }
            if (previousNumber === selectNum) {
                return;
            }
            var count = this.Storage.getItem(String(selectNum)) === undefined ? 0
                : +this.Storage.getItem(String(selectNum));
            storage.setItem(String(selectNum), String(count + 1));
        };
        /**
         * Use on click
         * @param {number} i number of clicked container
         */
        ReactionsModule.prototype.onContainerClick = function (i) {
            this.selectNumber = i;
            this.onSelect(this.selectNumber, this.previousNumber, this.Rendering.containers, this.Storage);
            this.setValues();
        };
        /**
             * Set previous number and shows selected counter
             */
        ReactionsModule.prototype.setValues = function () {
            if (!(this.previousNumber === undefined || this.previousNumber === NaN)) {
                this.Rendering.containers[this.previousNumber].style.backgroundColor = "";
                if (this.previousNumber !== undefined)
                    this.Rendering.containers[this.previousNumber].children[1].textContent = this.Storage.getItem(String(this.previousNumber));
            }
            if (this.previousNumber === this.selectNumber) {
                this.previousNumber = undefined;
                localStorage.setItem("selected", "undefiend");
            }
            else {
                if (this.selectNumber !== undefined) {
                    this.Rendering.containers[this.selectNumber].style.backgroundColor = "pink";
                }
                this.previousNumber = this.selectNumber;
                localStorage.setItem("selected", "" + this.selectNumber);
                this.Rendering.containers[this.selectNumber].children[1].textContent = this.Storage.getItem(String(this.selectNumber));
            }
        };
        return ReactionsModule;
    }());
    Module.ReactionsModule = ReactionsModule;
})(Module || (Module = {}));
//# sourceMappingURL=module.js.map