// normalize decisions to be either "aff" or "neg"
function normalizeSide(text) {
	const decision = (text || '').trim().toLowerCase();
	if (decision.startsWith('aff') || decision.startsWith('pro') || decision.startsWith('prop')) return 'aff';
	if (decision.startsWith('neg') || decision.startsWith('con') || decision.startsWith('opp')) return 'neg';
	return null;
}

function countVotes() {
	const table = document.querySelector('table#judgerecord');
	if (!table) return null;

	// finds the vote column from the judging record table
	const headers = [...table.querySelectorAll('thead th')].map((th) =>
		th.textContent.trim().toLowerCase(),
	);
	const voteCol = headers.indexOf('vote');
	if (voteCol === -1) return null;

	let aff = 0;
	let neg = 0;
	for (const tr of table.querySelectorAll('tbody tr')) {
		const side = normalizeSide(tr.children[voteCol]?.textContent);
		if (side === 'aff') aff++;
		else if (side === 'neg') neg++;
	}
	return { rounds: aff + neg, aff, neg };
}

chrome.runtime.onMessage.addListener((msg, _sender, reply) => {
	if (msg?.type !== 'GET_STATS') return;
	const overall = countVotes();
	reply(overall ? { ok: true, overall } : { ok: false });
});
