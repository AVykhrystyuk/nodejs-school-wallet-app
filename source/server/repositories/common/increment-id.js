'use strict';

module.exports = (items, idSelector) => {
	const maxId = items.reduce((max, item) => {
		const itemId = idSelector(item);
		return Math.max(max, itemId);
	}, 0);

	return maxId + 1;
};
