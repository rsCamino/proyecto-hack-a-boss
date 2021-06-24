const getEstablecimiento = require('./getEstablecimiento');
const newEstablecimiento = require('./newEstablecimiento');
const validateEstablecimiento = require('./validateEstablecimiento');
const loginEstablecimiento = require('./loginEstablecimiento');
const editEstablecimiento = require('./editEstablecimiento');
const editEstablecimientoPass = require('./editEstablecimientoPass');
const recoverEstablecimientoPass = require('./recoverEstablecimientoPass');
const resetEstablecimientoPass = require('./resetEstablecimientoPass');
const deleteEstablecimiento = require('./deleteEstablecimiento');
const puntajeEstablecimiento = require('./puntajeEstablecimiento');

module.exports = {
	getEstablecimiento,
	newEstablecimiento,
	validateEstablecimiento,
	loginEstablecimiento,
	editEstablecimiento,
	editEstablecimientoPass,
	recoverEstablecimientoPass,
	resetEstablecimientoPass,
	deleteEstablecimiento,
	puntajeEstablecimiento,
};
