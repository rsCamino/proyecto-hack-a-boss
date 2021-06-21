const getDB = require('../../ddbb/db');

const validateEstablecimiento = async (req, res, next) => {
	let connection;

	try {
		connection = await getDB();

		const { registrationCode } = req.params;

		const [establecimiento] = await connection.query(
			`SELECT id FROM establecimientos WHERE codigoRegistro = ?;`,
			[registrationCode]
		);

		if (establecimiento.length < 1) {
			const error = new Error(
				'No hay establecimientos pendientes de validar con este código'
			);
			error.httpStatus = 404;
			throw error;
		}

		await connection.query(
			`UPDATE establecimientos SET activo = true, codigoRegistro = NULL WHERE codigoRegistro = ?;`,
			[registrationCode]
		);

		res.send({
			status: 'ok',
			message: 'Establecimiento verificado, bienvenido!',
		});
	} catch (error) {
		next(error);
	} finally {
		if (connection) connection.release();
	}
};

module.exports = validateEstablecimiento;
