'use strict';

/* eslint-disable */

class Repository {
	constructor() {
		if (new.target === Repository) {
			throw new TypeError('Cannot construct instance of abstract class directly');
		}
	}

	async getAll() {}

	async get(id) {}

	async add() {}

	async remove(id) {}
}

/* eslint-enable */

module.exports = Repository;
