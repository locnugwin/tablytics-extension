const $ = (id) => document.getElementById(id);

async function requestStats() {
	const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
	if (!tab?.id) return null;
	try {
		const res = await chrome.tabs.sendMessage(tab.id, { type: 'GET_STATS' });
		return res?.ok ? res.overall : null;
	} catch {
		return null;
	}
}

function render(o) {
	const aff = o.rounds ? Math.round((o.aff / o.rounds) * 100) : 0;
	const neg = o.rounds ? 100 - aff : 0;

	$('total').textContent = o.rounds;
	$('aff-count').textContent = o.aff;
	$('neg-count').textContent = o.neg;

	$('bar-aff').style.width = `${aff}%`;
	$('bar-neg').style.width = `${neg}%`;
	$('bar-aff').textContent = aff >= 18 ? `Aff ${aff}%` : '';
	$('bar-neg').textContent = neg >= 18 ? `Neg ${neg}%` : '';
	$('split').setAttribute('aria-label', `${aff}% aff, ${neg}% neg`);
}

(async () => {
	const overall = await requestStats();
	if (overall) {
		render(overall);
		$('stats').hidden = false;
	} else {
		$('message').hidden = false;
	}
})();