var Module;
(function (Module) {
    var EMOJI_FILLER_STYLE = "\n\tbackground-color:grey;\n\twidth:100%;\n\theight: 100%;\n\tdisplay:flex;\n\tjustify-content:center;\n\tflex-wrap:wrap;\n\talign-items:center;\n\t";
    var EMOJI_CONTAINER_STYLE = "\n\theight:100%;\n\tflex:1 1 auto;\n\tdisplay:flex;\n\talign-items:stretch";
    var EMOJI_STYLE = "\n\tflex:1 1 auto;\n\tbackground:  no-repeat;\n\tbackground-size: cover 100% 100%;\n\tbackround-origin:content-box;\n\tbackground-size:contain;\n\tborder:1px solid";
    var INNERSPAN_STYLE = "\n\torder:-1;\n\tmargin:5%;\n\tfont-size:4ex;";
    var SmileStorage = /** @class */ (function () {
        function SmileStorage(Storage, saveFunc) {
            this.Storage = Storage;
            if (saveFunc !== undefined) {
                this.setItem = saveFunc;
            }
        }
        SmileStorage.prototype.getItem = function (key) {
            if ("getItem" in Storage) {
                var result = this.Storage.getItem("" + key);
            }
            else {
                result = this.Storage[key];
            }
            if (result === null) {
                result = undefined;
            }
            return result;
        };
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
    var Render;
    (function (Render) {
        var selectNumber = localStorage.getItem("selected") === null ?
            Infinity : +localStorage.getItem("selected");
        function render(config, onSelect) {
            if (config.Storage) {
                Storage = new SmileStorage(config.Storage, config.saveFunc);
            }
            _filler = CreateFiller();
            CreateText(config.text);
            CreateCounters(config, onSelect)
                .forEach(function (elem) { return _filler.appendChild(elem); }); // Insert containers into filler
            config.RootElement.appendChild(_filler);
        }
        Render.render = render;
        var _filler;
        var previousNumber;
        var Storage = new SmileStorage(localStorage);
        function CreateCounters(config, onSelect) {
            var containers = [];
            var _loop_1 = function (i) {
                var emot = config.arrayEmoji[i];
                var MAX_EMOT_LENGTH = 3;
                if (emot.length < MAX_EMOT_LENGTH) {
                    var container = CreateContainer(i);
                    var emoji = CreateEmoji(i, emot);
                    container.addEventListener("click", function (e) {
                        onContainerClick(i, onSelect, containers);
                    }.bind(this_1));
                    containers.push(container);
                    container.appendChild(emoji);
                }
            };
            var this_1 = this;
            for (var i = 0; i < config.arrayEmoji.length; i++) {
                _loop_1(i);
            }
            return containers;
        }
        function CreateEmoji(i, emot) {
            var emoji = document.createElement("div");
            emoji.textContent = Storage.getItem(String(i));
            emoji.style.cssText = EMOJI_STYLE;
            var code = (emot.codePointAt(0)).toString(16);
            emoji.style.backgroundImage = "url(https://badoocdn.com/big/chat/emoji@x2/" + code + ".png)";
            return emoji;
        }
        function CreateContainer(i) {
            var container = document.createElement("div");
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
        function CreateFiller() {
            var filler = document.createElement("div");
            filler.style.cssText = EMOJI_FILLER_STYLE;
            return filler;
        }
        function onContainerClick(i, onSelect, containers) {
            selectNumber = i;
            onSelect(selectNumber, previousNumber, containers, Storage);
            if (previousNumber !== undefined) {
                containers[previousNumber].style.backgroundColor = "";
            }
            if (previousNumber === selectNumber) {
                previousNumber = undefined;
                localStorage.setItem("selected", "undefiend");
            }
            else {
                containers[selectNumber].style.backgroundColor = "pink";
                previousNumber = selectNumber;
                localStorage.setItem("selected", "" + selectNumber);
            }
        }
        // Create Text element and insert it
        function CreateText(text) {
            var span = document.createElement("span");
            span.style.cssText = INNERSPAN_STYLE;
            if (text) {
                span.textContent = text;
            }
            _filler.appendChild(span);
        }
    })(Render || (Render = {}));
    var ReactionsModule = /** @class */ (function () {
        function ReactionsModule(config) {
            // Work with storage
            this.onSelect = function (selectNum, previousNumber, containers, storage) {
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
            this.RootElement = config.RootElement;
            Render.render(config, this.onSelect);
        }
        return ReactionsModule;
    }());
    Module.ReactionsModule = ReactionsModule;
})(Module || (Module = {}));
//# sourceMappingURL=module.js.map