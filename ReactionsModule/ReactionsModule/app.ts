class Greeter {
    public element: HTMLElement;
    public span: HTMLElement;
    public timerToken: number;

    public constructor(element: HTMLElement) {
        this.element = element;
        this.element.innerHTML += "The time is: ";
        this.span = document.createElement("span");
        this.element.appendChild(this.span);
        this.span.innerText = new Date().toUTCString();
    }

    public start() {
        this.timerToken = setInterval(() => this.span.innerHTML = new Date().toUTCString(), 500);
    }

    public stop() {
        clearTimeout(this.timerToken);
    }

}

window.onload = () => {

    const el = document.getElementById("content");
	   const greeter = new Greeter(el);
	const reactions = new Module.ReactionsModule({
		rootElement: document.querySelector(".reactions"),
		text: "How do you like this article?",
		arrayEmoji: ["👍", "🤔", "👎"]
	});
    greeter.start();
};
