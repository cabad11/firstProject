var Module;
(function (Module) {
    var EMOJI_FILLER_STYLE = "\n\tbackground-color:grey;\n\twidth:100%;\n\theight: 100%;\n\tdisplay:flex;\n\tjustify-content:center;\n\tflex-wrap:wrap;\n\talign-items:center;\n\t";
    var EMOJI_CONTAINER_STYLE = "\n\theight:100%;\n\tflex:1 1 auto;\n\tdisplay:flex;\n\talign-items:stretch";
    var EMOJI_STYLE = "\n\tflex:1 1 auto;\n\tbackground:  no-repeat;\n\tbackground-size: cover 100% 100%;\n\tbackround-origin:content-box;\n\tbackground-size:contain;\n\tborder:1px solid";
    var INNERSPAN_STYLE = "\n\torder:-1;\n\tmargin:5%;\n\tfont-size:4ex;";
    var SmileStorage = /** @class */ (function () {
        function SmileStorage(Storage, saveFunc) {
            this.Storage = Storage;
            if (saveFunc !== undefined)
                this.setItem = saveFunc;
        }
        SmileStorage.prototype.getItem = function (key) {
            if ("getItem" in Storage)
                var result = this.Storage.getItem("" + key);
            else
                result = this.Storage[key];
            if (result === null)
                result = undefined;
            return result;
        };
        SmileStorage.prototype.setItem = function (key, value) {
            if ("setItem" in Storage)
                this.Storage.setItem("" + key, String(value));
            else
                this.Storage[key] = String(value);
        };
        return SmileStorage;
    }());
    var ReactionsModule = /** @class */ (function () {
        function ReactionsModule(config) {
            this.selectNumber = localStorage.getItem("selected") === undefined ?
                Infinity : +localStorage.getItem("selected");
            this._text = document.createElement("span");
            this.containers = [];
            this.Storage = new SmileStorage(localStorage);
            this.onSelect = function (selectNum, previousNumber, containers, storage) {
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
            if (config.Storage) {
                this.Storage = new SmileStorage(config.Storage, config.saveFunc);
            }
            this.RootElement = config.RootElement;
            this._filler = document.createElement("div");
            this._filler.style.cssText = EMOJI_FILLER_STYLE;
            this._text = document.createElement("span");
            this._text.style.cssText = INNERSPAN_STYLE;
            if (config.text) {
                this.Text = config.text;
            }
            if (config.arrayEmoji) {
                var _loop_1 = function (i) {
                    var emot = config.arrayEmoji[i];
                    if (emot.length < 3) {
                        var container = document.createElement("div");
                        this_1.containers.push(container);
                        container.style.cssText = EMOJI_CONTAINER_STYLE;
                        if (i === this_1.selectNumber) {
                            container.style.backgroundColor = "pink";
                            this_1.previousNumber = this_1.selectNumber;
                        }
                        if (this_1.Storage.getItem(String(i)) === null) {
                            this_1.Storage.setItem(String(i), "0");
                        }
                        container.addEventListener("click", function (e) {
                            this.selectNumber = i;
                            this.onSelect(this.selectNumber, this.previousNumber, this.containers, this.Storage);
                            if (this.previousNumber !== undefined) {
                                this.containers[this.previousNumber].style.backgroundColor = "";
                            }
                            if (this.previousNumber === this.selectNumber) {
                                this.previousNumber = undefined;
                                localStorage.setItem("selected", "undefiend");
                            }
                            else {
                                this.containers[this.selectNumber].style.backgroundColor = "pink";
                                this.previousNumber = this.selectNumber;
                                localStorage.setItem("selected", this.selectNumber);
                            }
                        }.bind(this_1));
                        var emoji = document.createElement("div");
                        emoji.textContent = this_1.Storage.getItem(String(i));
                        emoji.style.cssText = EMOJI_STYLE;
                        var code = (emot.codePointAt(0)).toString(16);
                        emoji.style.backgroundImage = "url(https://badoocdn.com/big/chat/emoji@x2/" + code + ".png)";
                        container.appendChild(emoji);
                        this_1._filler.appendChild(container);
                    }
                    else {
                        throw new Error("длина смайла =" + emot.length);
                    }
                };
                var this_1 = this;
                for (var i = 0; i < config.arrayEmoji.length; i++) {
                    _loop_1(i);
                }
            }
            this._filler.appendChild(this._text);
            config.RootElement.appendChild(this._filler);
        }
        Object.defineProperty(ReactionsModule.prototype, "Text", {
            set: function (value) {
                if (typeof (value) === "string") {
                    this._text.textContent = value;
                }
                else {
                    console.log("данные некорректны");
                }
            },
            enumerable: true,
            configurable: true
        });
        return ReactionsModule;
    }());
    Module.ReactionsModule = ReactionsModule;
})(Module || (Module = {}));
//# sourceMappingURL=module.js.map