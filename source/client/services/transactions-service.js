import axios from 'axios';

// eslint-disable-next-line
export class TransactionsService {
	getAll() {
		return axios.get('/transactions').then(response => response.data);
	}
}
