require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const app = express();

const { PORT } = process.env;

const {
	getEstablecimientos,
} = require('./establecimientos/getEstablecimientos');

app.use(morgan('dev'));

app.use(express.json());

app.get('/establecimientos', getEstablecimientos);

app.listen(PORT, () =>
	console.log(`Server listening at http://localhost${PORT}`)
);
