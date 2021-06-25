const validateUsuario = require('./validateUsuario');
const newUsuario = require('./newUsuario');
const getUsuario = require('./getUsuario');
const loginUsuario = require('./loginUsuario');
const editUsuario = require('./editUsuario');
const deleteUsuario = require('./deleteUsuario');
const editUsuarioPass = require('./editUsuarioPass');
const recoverUsuarioPass = require('./recoverUsuarioPass');
const resetUsuarioPass = require('./resetUsuarioPass');

module.exports = {
	validateUsuario,
	newUsuario,
	getUsuario,
	loginUsuario,
	editUsuario,
	deleteUsuario,
	editUsuarioPass,
	recoverUsuarioPass,
	resetUsuarioPass,
};
