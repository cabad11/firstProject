var Renderer = /** @class */ (function () {
    /**
 * Create elements for module
 * @param {Iconfig} config - Module parameters
 * @param {function} onContainerClick - use on container click
 */
    function Renderer(config, onContainerClick) {
        var _this = this;
        this.config = config;
        this.onContainerClick = onContainerClick;
        this.containers = [];
        this.storage = new SmileStorage(localStorage);
        if (config.storage) {
            this.storage = new SmileStorage(config.storage, config.saveFunc);
        }
        this._holder = this.CreateHolder();
        this.CreateText();
        this.CreateCounters() // Create array of containers
            .forEach(function (elem) { return _this._holder.appendChild(elem); }); // Insert containers into filler
        config.rootElement.appendChild(this._holder);
    }
    /**
     * Create counter container
     * @param {number} i - number of container
     */
    Renderer.prototype.CreateContainer = function (i) {
        var _this = this;
        var container = this.createElement("div", "container");
        container.addEventListener("click", (function (e) {
            _this.onContainerClick(i);
        }).bind(this));
        return container;
    };
    /**
     * Create array of counters
     */
    Renderer.prototype.CreateCounters = function () {
        var _this = this;
        this.config.arrayEmoji.forEach(function (item, i) {
            var MAX_EMOT_LENGTH = 2;
            if (item.length > MAX_EMOT_LENGTH) {
                return;
            }
            var container = _this.CreateContainer(i);
            var emoji = _this.CreateEmoji(i, item);
            var count = _this.CreateCountText(i);
            _this.containers.push(container);
            container.appendChild(emoji);
            container.appendChild(count);
        });
        return this.containers;
    };
    /**
     * Create elem which show counter
     * @param i i - number of container
     */
    Renderer.prototype.CreateCountText = function (i) {
        var count = this.storage.getItem(String(i)) === undefined ? "0" : this.storage.getItem(String(i));
        var elem = this.createElement("div", "countText", count);
        return elem;
    };
    /**
     * Create a element
     * @param {string} tag - tag of element
     * @param {string} useClass - class of element
     * @param {string} text? - text in element
     * @returns
     */
    Renderer.prototype.createElement = function (tag, useClass, text) {
        var elem = document.createElement(tag);
        if (text !== undefined) {
            elem.textContent = text;
        }
        elem.classList.add(useClass);
        return elem;
    };
    /**
     * Create elem with emotion
     * @param {number} i - Number of container
     * @param {string} emot - Emotion symbol
     */
    Renderer.prototype.CreateEmoji = function (i, emot) {
        var wrapper = this.createElement("div", "emoji");
        var emoji = new Image();
        emoji.classList.add("emojiImg");
        var code = (emot.codePointAt(0)).toString(16);
        emoji.src = "https://badoocdn.com/big/chat/emoji@x2/" + code + ".png";
        wrapper.appendChild(emoji);
        return wrapper;
    };
    /**
     * Create main element
     */
    Renderer.prototype.CreateHolder = function () {
        var filler = this.createElement("div", "holder");
        return filler;
    };
    /**
     * Create Text element and insert it
     */
    Renderer.prototype.CreateText = function () {
        var span = this.createElement("span", "mainText", this.config.text);
        this._holder.appendChild(span);
    };
    return Renderer;
}());
//# sourceMappingURL=Renderer.js.map