'use strict';

const {
	FileRepository,
	incrementId
} = require('./common');

class TransactionsRepository extends FileRepository {
	constructor() {
		super('transactions.json');
	}

	async add(transaction) {
		const transactions = await this.getAll();
		const newTransaction = Object.assign({}, transaction, {
			id: incrementId(transactions, c => c.id)
		});

		transactions.push(newTransaction);
		await this._saveUpdates(transactions);
		return newTransaction;
	}

	async get(id) {
		const transactions = await this.getAll();
		return transactions.find(t => t.id === id);
	}

	async getAllByCardId(cardId) {
		const transactios = await this.getAll();
		return transactios.filter(t => t.cardId === cardId);
	}

	async remove(id) {
		const transactios = await this.getAll();
		const transactionIndex = transactios.findIndex(с => с.id === id);
		if (!transactionIndex < 0) {
			return null;
		}

		const transactionToRemove = transactios[transactionIndex];
		transactios.splice(transactionIndex, 1);
		await this._saveUpdates(transactios);

		return transactionToRemove;
	}
}

module.exports = TransactionsRepository;
