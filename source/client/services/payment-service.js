import axios from 'axios';

// eslint-disable-next-line
export class PaymentService {
	payMobile(cardId, amount, phoneNumber) {
		return axios.post(`/cards/${cardId}/pay`, {
			amount,
			phoneNumber
		});
	}
}
