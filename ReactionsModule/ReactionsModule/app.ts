window.onload = () => {
	const reactions = new Module.ReactionsModule({
		rootElement: document.querySelector('.reactions'),
		text: 'How do you like this article?',
		arrayEmoji: ['👍', '🤔', '👎']
	});
};