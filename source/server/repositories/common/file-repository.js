'use strict';

const fs = require('fs');
const path = require('path');

const {
	promisify
} = require('util');

const Repository = require('./repository');

const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

class FileRepository extends Repository {
	constructor(sourceFileName) {
		super();
		this._filePath = path.join(__dirname, '..', '..', 'data', sourceFileName);
	}

	async getAll() {
		const json = await readFileAsync(this._filePath);
		return JSON.parse(json);
	}

	_saveUpdates(data) {
		const json = JSON.stringify(data, null, 4);
		return writeFileAsync(this._filePath, json);
	}
}

module.exports = FileRepository;
