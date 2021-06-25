require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const fileUpload = require('express-fileupload');
const app = express();

const { PORT } = process.env;

//*Middlewares

app.use(morgan('dev'));
app.use(fileUpload());
app.use(express.json());

const establecimientoExist = require('./middlewares/establecimientoExist');
const usuarioExist = require('./middlewares/usuarioExist'); //Cambios Viernes 25
const authEntity = require('./middlewares/authEntity');

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

//* Controladores Usuarios. Cambios Viernes 25.
const {
	newUsuario,
	validateUsuario,
	getUsuario,
	loginUsuario,
	addPhotoUsuario,
	deletePhotoUsuario,
	editUsuario,
	deleteUsuario,
	editUsuarioPass,
	recoverUsuarioPass,
	resetUsuarioPass,
	addNewComment,
	deleteComment,
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

//* Obtener un Usuario. Cambios Viernes 25
app.get('/usuarios/:idUsuario', usuarioExist, authEntity, getUsuario);

//*Loguearse como usuario.

app.post('/usuarios/login', loginUsuario);

//* Subir imagen.
app.post('/usuarios/:idUsuario/photos', authEntity, addPhotoUsuario);

//* Borrar fotos.
app.delete(
	'/usuarios/:idUsuarios/photos/:idPhoto',
	//Se debe añadir userExist
	authEntity,
	deletePhotoUsuario
);

//*Agregar comentario

app.post(
	'/usuarios/:idUsuario/photos/:idImagen/comments',
	authEntity,
	addNewComment
);

//*Editar un usuario. Cambios Viernes 25

app.put('/usuarios/:idUsuario', usuarioExist, authEntity, editUsuario);

//*Editar la contraseña de un usuario. Cambios viernes 25

app.put(
	'/usuarios/:idUsuario/password',
	usuarioExist,
	authEntity,
	editUsuarioPass
);

//*Recuperar contraseña. Cambios viernes 25

app.put('/usuarios/password/recover', recoverUsuarioPass);

//*Reset contraseña. Cambios Viernes 25. Esto tiene sentido con la anterior?

app.put('/usuarios/password/reset', resetUsuarioPass);

//* Eliminar un usuario. Cambios Viernes 25

app.delete('/usuarios/:idUsuario', usuarioExist, authEntity, deleteUsuario);

app.delete(
	'/usuarios/:idUsuario/photos/:idPhoto/comments/:idComentario/delete',
	authEntity,
	deleteComment
);

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
