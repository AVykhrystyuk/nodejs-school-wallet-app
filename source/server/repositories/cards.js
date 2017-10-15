'use strict';

const {
	FileRepository,
	incrementId
} = require('./common');

class CardsRepository extends FileRepository {
	constructor() {
		super('cards.json');
	}

	async add(card) {
		const cards = await this.getAll();
		const newCard = Object.assign({}, card, {
			id: incrementId(cards, c => c.id)
		});

		cards.push(newCard);
		await this._saveUpdates(cards);
		return newCard;
	}

	async update(card) {
		const cards = await this.getAll();
		const cardIndex = cards.findIndex(с => с.id === card.id);
		if (cardIndex < 0) {
			return null;
		}

		cards[cardIndex] = card;

		await this._saveUpdates(cards);
		return card;
	}

	async get(id) {
		const cards = await this.getAll();
		return cards.find(с => с.id === id);
	}

	async remove(id) {
		const cards = await this.getAll();
		const cardIndex = cards.findIndex(с => с.id === id);
		if (!cardIndex < 0) {
			return null;
		}

		const cardToRemove = cards[cardIndex];
		cards.splice(cardIndex, 1);
		await this._saveUpdates(cards);

		return cardToRemove;
	}
}

module.exports = CardsRepository;
