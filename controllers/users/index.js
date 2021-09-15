const validateUsuario = require('./validateUsuario');
const newUsuario = require('./newUsuario');
const getUsuario = require('./getUsuario');
const loginUsuario = require('./loginUsuario');
const addPhotoUsuario = require('./addPhotoUsuario');
const uploadPhotoUsuario = require('./uploadPhotoUsuario');
const editUsuario = require('./editUsuario');
const deleteUsuario = require('./deleteUsuario');
const editUsuarioPass = require('./editUsuarioPass');
const recoverUsuarioPass = require('./recoverUsuarioPass');
const resetUsuarioPass = require('./resetUsuarioPass');
const deletePhotoUsuario = require('./deletePhotoUsuario');
const addNewComment = require('./addNewComment');
const deleteComment = require('./deleteComment');
const likePhoto = require('./likePhoto');
const getUsersPhotos = require('./getUsersPhotos');
const getPhotoComments = require('./getPhotoComments');
const getAllUsers = require('./getAllUsers');
const getAvatarUsers = require('./getAvatarUsers');

module.exports = {
	validateUsuario,
	newUsuario,
	getUsuario,
	loginUsuario,
	addPhotoUsuario,
	uploadPhotoUsuario,
	editUsuario,
	deleteUsuario,
	editUsuarioPass,
	recoverUsuarioPass,
	resetUsuarioPass,
	deletePhotoUsuario,
	addNewComment,
	deleteComment,
	likePhoto,
	getUsersPhotos,
	getPhotoComments,
	getAllUsers,
	getAvatarUsers,
};
