const regex = /\b(\w*(covid|corona|death.*case|case.*death|quarantine)\w*)\b/i;

const config = {
	attributes: true,
	childList: true,
	subtree: true,
};

const callback = (mutationsList, observer) => {
	mutationsList.forEach(mutation => {
		if (mutation.type === 'childList') {
			if (mutation.addedNodes.length > 0) {
				filter(Array.from(mutation.addedNodes).reduce(flatten, []));
			}
		}
	});
};

const filter = nodes => {
	nodes = nodes.filter(el => {
		if ($(el).is('a') && el.href && regex.test(el.href)) {
			el.href = '#';
			return true;
		} else if (
			el.nodeType != 3 &&
			el.innerText &&
			regex.test(el.innerText)
		) {
			return true;
		} else if (el.nodeType == 3 && regex.test(el.textContent)) {
			return true;
		}
	});
	nodes.forEach(node => {
		const $element = $(node);
		if ($element.children().length < 1) {
			$element.addClass('infected');
			if ($element.is('strong,span,b,i,em') || node.nodeType == 3) {
				$element.parent().addClass('infected');
			}
		}
	});
};

const flatten = (ops, n) => {
	if (n.childNodes && n.childNodes.length) {
		[].reduce.call(n.childNodes, flatten, ops);
	}
	ops.push(n);
	return ops;
};

const observer = new MutationObserver(callback);

setTimeout(() => {
	observer.observe(document.body, config);
	const nodes = [document.body].reduce(flatten, []);
	filter(nodes);
}, 0);
