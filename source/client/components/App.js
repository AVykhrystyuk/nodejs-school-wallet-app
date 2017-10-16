import React, { Component } from 'react';
import styled from 'emotion/react';
import { injectGlobal } from 'emotion';
import CardInfo from 'card-info';
import {
	CardsBar,
	Header,
	History,
	Prepaid,
	MobilePayment,
	Withdraw
} from './';

import './fonts.css';

import cardsData from '../../server/data/cards.json';
import transactionsData from '../../server/data/transactions.json';
import { CardsService, TransactionsService } from '../services';

injectGlobal([`
	html,
	body {
		margin: 0;
	}

	#root {
		height: 100%;
		font-family: 'Open Sans';
		color: #000;
	}
`]);

const Wallet = styled.div`
	display: flex;
	min-height: 100%;
	background-color: #fcfcfc;
`;

const CardPane = styled.div`
	flex-grow: 1;
`;

const Workspace = styled.div`
	display: flex;
	flex-wrap: wrap;
	max-width: 970px;
	padding: 15px;
`;

/**
 * Приложение
 */
class App extends Component {
	static prepareCardList(cards) {
		return cards.map(card => {
			const cardInfo = new CardInfo(card.cardNumber, {
				banksLogosPath: '/assets/',
				brandsLogosPath: '/assets/'
			});

			return {
				id: card.id,
				balance: card.balance,
				number: cardInfo.numberNice,
				bankName: cardInfo.bankName,
				theme: {
					bgColor: cardInfo.backgroundColor,
					textColor: cardInfo.textColor,
					bankLogoUrl: cardInfo.bankLogoSvg,
					brandLogoUrl: cardInfo.brandLogoSvg,
					bankSmLogoUrl: `/assets/${cardInfo.bankAlias}-history.svg`
				}
			};
		});
	}

	static prepareHistory(cardsList, transactions) {
		return transactions.map(transaction => {
			const card = cardsList.find(item => item.id === Number(transaction.cardId));
			return card
				? Object.assign({}, transaction, { card })
				: transaction;
		});
	}

	constructor() {
		super();

		this.cardsService = new CardsService();
		this.transactionsService = new TransactionsService();

		const cardsList = App.prepareCardList(cardsData);
		const cardHistory = App.prepareHistory(cardsList, transactionsData);

		this.state = {
			cardsList,
			cardHistory,
			activeCardIndex: 0,
			removeCardId: 0,
			isCardRemoving: false,
			isCardsEditable: false
		};
	}

	onCardChange(activeCardIndex) {
		this.setState({ activeCardIndex });
	}

	onEditChange(isEditable) {
		const isCardsEditable = !isEditable;
		this.setState({
			isCardsEditable,
			isCardRemoving: false
		});
	}

	onSuccessTransaction() {
		this.cardsService.getAll().then(cards => {
			const cardsList = App.prepareCardList(cards);
			this.setState({ cardsList });

			this.transactionsService.getAll().then(transactions => {
				const cardHistory = App.prepareHistory(cardsList, transactions);
				this.setState({ cardHistory });
			});
		});
	}

	onChangeBarMode(event, removeCardId) {
		event.stopPropagation();
		this.setState({
			isCardRemoving: true,
			removeCardId
		});
	}

	deleteCard(cardId) {
		this.cardsService.deleteCard(cardId).then(removedCard => {
			this.cardsService.getAll().then(cards => {
				const cardsList = App.prepareCardList(cards);
				this.setState({ cardsList });
			});
		});
	}

	/**
	 * Рендер компонента
	 *
	 * @override
	 * @returns {JSX}
	 */
	render() {
		const { cardsList, activeCardIndex, cardHistory, isCardsEditable, isCardRemoving, removeCardId } = this.state;
		const activeCard = cardsList[activeCardIndex];

		const inactiveCardsList = cardsList.filter((card, index) => index !== activeCardIndex);
		const filteredHistory = cardHistory.filter(data => data.cardId === activeCard.id);

		return (
			<Wallet>
				<CardsBar
					activeCardIndex={activeCardIndex}
					removeCardId={removeCardId}
					cardsList={cardsList}
					onCardChange={index => this.onCardChange(index)}
					isCardsEditable={isCardsEditable}
					isCardRemoving={isCardRemoving}
					deleteCard={index => this.deleteCard(index)}
					onChangeBarMode={(event, index) => this.onChangeBarMode(event, index)} />
				<CardPane>
					<Header activeCard={activeCard} />
					<Workspace>
						<History cardHistory={filteredHistory} />
						<Prepaid
							activeCard={activeCard}
							inactiveCardsList={inactiveCardsList}
							onCardChange={newActiveCardIndex => this.onCardChange(newActiveCardIndex)}
							onTransaction={() => this.onSuccessTransaction()} />
						<MobilePayment
							activeCard={activeCard}
							onTransaction={() => this.onSuccessTransaction()} />
						<Withdraw
							activeCard={activeCard}
							inactiveCardsList={inactiveCardsList}
							onTransaction={() => this.onSuccessTransaction()} />
					</Workspace>
				</CardPane>
			</Wallet>
		);
	}
}

export default App;
