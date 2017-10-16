import axios from 'axios';

// eslint-disable-next-line
export class CardsService {
	getAll() {
		return axios.get('/cards').then(response => response.data);
	}

	deleteCard(cardId) {
		return axios.delete(`/cards/${cardId}`).then(response => response.data);
	}
}
