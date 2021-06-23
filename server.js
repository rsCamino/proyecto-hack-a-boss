require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const app = express();

const { PORT } = process.env;

//*Middlewares

app.use(morgan('dev'));
app.use(express.json());

const establecimientoExist = require('./middlewares/establecimientoExist');
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
} = require('./controllers/establecimientos');

//* Controladores Usuarios.
const { 
	newUsuario, 
	validateUsuario, 
	getUsuario, 
	loginUsuario }
	 = require('./controllers/users');

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

//* Crear Usuario.

app.post('/usuarios',newUsuario);


//* Validar Usuario.

app.get(
	'/usuarios/validate/:registrationCode',
	validateUsuario
);

//* Obtener un Usuario.

app.get('/usuarios/:idUsuarios', getUsuario);

//*Loguearse como usuario.

app.post('/usuarios/login', loginUsuario);

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
