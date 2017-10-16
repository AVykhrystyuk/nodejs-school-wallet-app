import axios from 'axios';

// eslint-disable-next-line
export class PaymentService {
	payMobile(cardId, sum, phoneNumber) {
		return axios.post(`/cards/${cardId}/pay`, {
			sum,
			phoneNumber
		});
	}
}
