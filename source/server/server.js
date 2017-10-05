'use strict';

const Koa = require('koa');
const serve = require('koa-static');
const router = require('koa-router')();
const bodyParser = require('koa-bodyparser')();
const fs = require('fs');

const logger = require('./libs/logger')('waller-app');

const getAllCardsController = require('./controllers/cards/get-all');
const createCardController = require('./controllers/cards/create');
const deleteCardController = require('./controllers/cards/delete');

const getAllCardTransactionsController = require('./controllers/transactions/get-all-for-card');
const createCardTransactionsController = require('./controllers/transactions/create');

const errorController = require('./controllers/error');

const ApplicationError = require('./errors/application-error');

const CardsRepository = require('./repositories/cards');
const TransactionsRepository = require('./repositories/transactions');

const server = new Koa();

router.param('id', (id, ctx, next) => next());

router.get('/', ctx => {
	ctx.body = fs.readFileSync('./build/index.html', 'utf8');
});

router.get('/cards/', getAllCardsController);
router.post('/cards/', createCardController);
router.delete('/cards/:id', deleteCardController);

router.get('/cards/:id/transactions', getAllCardTransactionsController);
router.post('/cards/:id/transactions', createCardTransactionsController);

router.all('/error', errorController);

// logger
server.use(async (ctx, next) => {
	const start = new Date();
	await next();
	const ms = new Date() - start;
	logger.log('info', `${ctx.method} ${ctx.url} - ${ms}ms`);
});

// error handler
server.use(async (ctx, next) => {
	try {
		await next();
	} catch (err) {
		logger.log('error', 'Error detected', err);
		ctx.status = err instanceof ApplicationError ? err.status : 500;
		ctx.body = err.message;
	}
});

server.use(async (ctx, next) => {
	ctx.cardsRepository = new CardsRepository();
	ctx.transactionsRepository = new TransactionsRepository();
	await next();
});

server.use(bodyParser);
server.use(router.routes());
server.use(serve('./build'));

const port = process.env.PORT || 3000;
server.listen(port, () => {
	const url = `http://localhost:${port}`;
	logger.log('info', `Server is listening on port ${port} (${url})`);
});
