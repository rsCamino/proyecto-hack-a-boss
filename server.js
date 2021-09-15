require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const path = require('path');

const app = express();
const { PORT } = process.env;

app.use(
	cors({
		origin: '*',
		credentials: true,
	})
);

//*Middlewares

app.use(morgan('dev'));
app.use(fileUpload());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'static')));

const establecimientoExist = require('./middlewares/establecimientoExist');
const usuarioExist = require('./middlewares/usuarioExist');
const authEntity = require('./middlewares/authEntity');
const photoExist = require('./middlewares/photoExists');
const comentarioExist = require('./middlewares/comentarioExists');

//* Controladores de establecimientos.
const {
	getEstablecimiento,
	newEstablecimiento,
	validateEstablecimiento,
	loginEstablecimiento,
	editEstablecimiento,
	editEstablecimientoPass,
	recoverEstablecimientoPass,
	resetEstablecimientoPass,
	deleteEstablecimiento,
	addPhotoEstablecimiento,
	puntajeEstablecimiento,
	deleteFotoEstablecimiento,
} = require('./controllers/establecimientos');

//* Controladores Usuarios. .
const {
	newUsuario,
	validateUsuario,
	getUsuario,
	loginUsuario,
	addPhotoUsuario,
	uploadPhotoUsuario,
	deletePhotoUsuario,
	editUsuario,
	deleteUsuario,
	editUsuarioPass,
	recoverUsuarioPass,
	resetUsuarioPass,
	addNewComment,
	deleteComment,
	likePhoto,
	getUsersPhotos,
	getPhotoComments,
	getAllUsers,
	getAvatarUsers,
} = require('./controllers/users');

//TODO Endpoints establecimientos.

//* Obtener un establecimiento.
app.get(
	'/establecimientos/:idEstablecimiento',
	establecimientoExist,
	authEntity,
	getEstablecimiento
);

//* Crear un establecimiento.
app.post('/establecimientos', newEstablecimiento);

//* Validar un establecimiento.
app.get(
	'/establecimientos/validate/:registrationCode',
	validateEstablecimiento
);

//* Loguearse como establecimiento.
app.post('/establecimientos/login', loginEstablecimiento);

//* Editar un establecimiento.
app.put(
	'/establecimientos/:idEstablecimiento',
	establecimientoExist,
	authEntity,
	editEstablecimiento
);

//* Editar la contraseña de un establecimiento.
app.put(
	'/establecimientos/:idEstablecimiento/password',
	establecimientoExist,
	authEntity,
	editEstablecimientoPass
);

//* Recuperar la contraseña de un establecimiento.
app.put('/establecimientos/password/recover', recoverEstablecimientoPass);

//* Resetear la contraseña de un establecimiento.
app.put('/establecimientos/password/reset', resetEstablecimientoPass);

//* Eliminar un establecimiento.
app.delete(
	'/establecimientos/:idEstablecimiento',
	establecimientoExist,
	authEntity,
	deleteEstablecimiento
);

//* Agrega una foto al establecimiento.
app.post(
	'/establecimientos/:idEstablecimiento/photos',
	authEntity,
	addPhotoEstablecimiento
);

//* Puntuar establecimiento.
app.post(
	'/establecimientos/:idEstableciemiento/valoraciones',
	establecimientoExist,
	authEntity,
	puntajeEstablecimiento
);

//* Borrar una foto de un establecimiento.

app.delete(
	'/establecimientos/:idEstablecimiento/photos/:idPhoto',
	establecimientoExist,
	authEntity,
	deleteFotoEstablecimiento
);

//TODO Endpoints usuarios.

//* Crear Usuario.
app.post('/usuarios', newUsuario);

//* Validar Usuario.
app.get('/usuarios/validate/:registrationCode', validateUsuario);

//* Obtener un Usuario.
app.get('/usuarios/:idUsuario', usuarioExist, getUsuario);
// authEntity,

//*Loguearse como usuario.
app.post('/usuarios/login', loginUsuario);

//* Subir avatar.
app.post('/usuarios/:idUsuario/photos', authEntity, addPhotoUsuario);

//*Get Avatar.
app.get('/usuarios/avatar/users', usuarioExist, getAvatarUsers);

//* Subir imagen.
app.post('/usuarios/:idUsuario/upload', authEntity, uploadPhotoUsuario);

//* Borrar fotos.
app.delete(
	'/usuarios/:idUsuario/photos/:idPhoto',
	photoExist,
	usuarioExist,
	authEntity,
	deletePhotoUsuario
);

//*Agregar comentario
app.post(
	'/usuarios/:idUsuario/photos/:idImagen/comment',
	authEntity,
	addNewComment
);

//*Editar un usuario.
app.put('/usuarios/:idUsuario', usuarioExist, authEntity, editUsuario);

//*Editar la contraseña de un usuario.
app.put(
	'/usuarios/:idUsuario/password',
	usuarioExist,
	authEntity,
	editUsuarioPass
);

//*Recuperar contraseña.
app.put('/usuarios/password/recover', recoverUsuarioPass);

//*Reset contraseña.
app.put('/usuarios/password/reset', resetUsuarioPass);

//* Eliminar un usuario.
app.delete('/usuarios/:idUsuario', usuarioExist, authEntity, deleteUsuario);

//*Eliminar un comentario.
app.delete(
	'/usuarios/:idUsuario/photos/:idPhoto/comments/:idComentario/delete',
	comentarioExist,
	authEntity,
	deleteComment
);

//*Dar like a una foto.
app.put(
	'/usuarios/:idUsuario/photos/:idPhoto/like',
	photoExist,
	authEntity,
	likePhoto
);

//*Obtener todas las fotos.
app.get('/usuarios/photos/all', getUsersPhotos);

//*Obtener avatares.
app.get('/usuarios/avatar/users', getAvatarUsers);

//*Obtener los comentarios de una foto.
app.get('/usuarios/photos/comments', getPhotoComments);

//* Obtener todos los usuarios.
app.get('/usuarios/all/users', getAllUsers);

//! Middleware de error.

app.use((error, req, res, next) => {
	console.error(error);
	res.status(error.httpStatus || 500).send({
		status: 'Error',
		message: error.message,
	});
});

//! Middleware de no encontrado.
app.use((req, res) => {
	res.status(404).send({
		status: 'Error',
		message: 'Not found',
	});
});

app.listen(PORT, () =>
	console.log(`Server listening at http://localhost${PORT}`)
);
