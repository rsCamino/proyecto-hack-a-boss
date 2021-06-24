const getDB = require('../../ddbb/db');

const { formatDate } = require('../../helpers');

const puntajeEstablecimiento = async (req, res, next) => {
	let connection;

	try {
		connection = await getDB();

		const { idUsuario } = req.userAuth;
		const { vote } = req.body;

		if (vote < 1 || vote > 5) {
			const error = new Error('El voto debe estar entre 1 y 5');
			error.httpStatus = 400;
			throw error;
		}

		const [alreadyVote] = await connection.query(
			`SELECT id FROM valoraciones WHERE idUsuario = ? AND idEstablecimiento = ?`,
			[idUsuario, idEstablecimiento]
		);

		if (alreadyVote.length > 0) {
			const error = new Error('Ya votaste esta entrada anteriormente');
			error.httpStatus = 403;
			throw error;
		}

		await connection.query(
			`INSERT INTO valoraviones (fechavaloracion, puntaje, idUsuario, idEstablecimiento) VALUES (?, ?, ?, ?);`,
			[formatDate(new Date()), puntaje, idUsuario, idEstablecimiento]
		);

		const [newAvg] = await connection.query(
			`
                SELECT AVG(valoraciones.puntaje) AS puntaje
                FROM valoraciones               
                WHERE valoraciones.idEstablecimiento = ?;
            `,
			[idEstablecimiento]
		);

		res.send({
			status: 'ok',
			data: {
				votes: newAvg[0].votes,
			},
		});
	} catch (error) {
		next(error);
	} finally {
		if (connection) connection.release();
	}
};

module.exports = puntajeEstablecimiento;
