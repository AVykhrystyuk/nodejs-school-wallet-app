'use strict';

module.exports = async(ctx) => {
	const cardId = Number(ctx.params.id);
	const removedCard = await ctx.cardsRepository.remove(cardId);
	if (!removedCard) {
		throw new ApplicationError(`No card with id ${cardId}`, 404);
	}
	
	ctx.status = 200;
};
