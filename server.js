require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const app = express();

const { PORT } = process.env;

//*Middlewares

app.use(morgan('dev'));
app.use(express.json());

const establecimientoExist = require('./middlewares/establecimientoExist');

//* Controladores de establecimientos.
const {
	getEstablecimiento,
	newEstablecimiento,
	validateEstablecimiento,
	loginEstablecimiento,
} = require('./controllers/establecimientos');

//* Obtener un establecimiento.
app.get(
	'/establecimientos/:idEstablecimiento',
	establecimientoExist,
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
