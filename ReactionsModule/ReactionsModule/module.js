var Module;
(function (Module) {
    var EMOJI_FILLER_STYLE = "\n\tbackground-color:grey;\t\n\twidth:100%;\n\theight: 100%;\n\tdisplay:flex;\n\tjustify-content:center;\n\tflex-wrap:wrap;\n\talign-items:center;\n\t";
    var EMOJI_CONTAINER_STYLE = "\n\theight:100%;\n\tflex:1 1 auto;\n\tdisplay:flex;\n\talign-items:stretch";
    var EMOJI_STYLE = "\n\tflex:1 1 auto;\n\tbackground:  no-repeat;\n\tbackground-size: cover 100% 100%;\n\tbackround-origin:content-box;\n\tbackground-size:contain;\n\tborder:1px solid";
    var INNERSPAN_STYLE = "\n\torder:-1;\n\tmargin:5%;\n\tfont-size:4ex;";
    var ReactionsModule = /** @class */ (function () {
        function ReactionsModule(element, text, arrayEmoji, obj) {
            if (obj === void 0) { obj = localStorage; }
            this.element = element;
            this.obj = obj;
            this._innerspan = document.createElement("span");
            this.containers = [];
            this.selectNumber = localStorage.getItem("selected") === undefined || localStorage.getItem("selected") === null ? Infinity : +localStorage.getItem("selected");
            this.onSelect = function (selectNum, containers, previousNumber) {
                if (previousNumber !== undefined) {
                    this.obj.setItem(String(previousNumber), String(+this.obj.getItem(String(previousNumber)) - 1));
                    containers[previousNumber].children[0].textContent = this.obj.getItem(String(previousNumber));
                }
                if (previousNumber === selectNum) {
                    previousNumber = undefined;
                    return;
                }
                this.obj.setItem(String(selectNum), String(+this.obj.getItem(String(selectNum)) + 1));
                containers[selectNum].children[0].textContent = this.obj.getItem(String(selectNum));
            };
            this._filler = document.createElement("div");
            this._filler.style.cssText = EMOJI_FILLER_STYLE;
            this._innerspan = document.createElement("span");
            this._innerspan.style.cssText = INNERSPAN_STYLE;
            if (text)
                this.Text = text;
            if (arrayEmoji) {
                var _loop_1 = function (i) {
                    emot = arrayEmoji[i];
                    if (emot.length < 3) {
                        var container = document.createElement("div");
                        this_1.containers.push(container);
                        container.style.cssText = EMOJI_CONTAINER_STYLE;
                        if (i === this_1.selectNumber) {
                            container.style.backgroundColor = "pink";
                            this_1.previousNumber = this_1.selectNumber;
                        }
                        ;
                        if (obj.getItem(String(i)) === null)
                            obj.setItem(String(i), "0");
                        container.addEventListener("click", function (e) {
                            this.selectNumber = i;
                            this.onSelect(this.selectNumber, this.containers, this.previousNumber);
                            if (this.previousNumber !== undefined)
                                this.containers[this.previousNumber].style.backgroundColor = "";
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
                        emoji = document.createElement("div");
                        emoji.textContent = obj.getItem(String(i));
                        emoji.style.cssText = EMOJI_STYLE;
                        code = (emot.codePointAt(0)).toString(16);
                        emoji.style.backgroundImage = "url(https://badoocdn.com/big/chat/emoji@x2/" + code + ".png)";
                        container.appendChild(emoji);
                        this_1._filler.appendChild(container);
                    }
                    else
                        console.log("длина смайла =" + emot.length);
                };
                var this_1 = this, emot, emoji, code;
                for (var i = 0; i < arrayEmoji.length; i++) {
                    _loop_1(i);
                }
            }
            this._filler.appendChild(this._innerspan);
            element.appendChild(this._filler);
        }
        Object.defineProperty(ReactionsModule.prototype, "Text", {
            set: function (value) {
                if (typeof (value) == "string")
                    this._innerspan.textContent = value;
                else
                    console.log("данные некорректны");
            },
            enumerable: true,
            configurable: true
        });
        ;
        return ReactionsModule;
    }());
    Module.ReactionsModule = ReactionsModule;
})(Module || (Module = {}));
//# sourceMappingURL=module.js.map