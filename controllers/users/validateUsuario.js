const getDB = require('../../ddbb/db');

const validateUsuario = async (req, res, next) => {
	let connection;

	try {
		connection = await getDB();

		const { registrationCode } = req.params;

		const [usuario] = await connection.query(
			`SELECT id FROM usuarios WHERE codigoRegistro = ?;`,
			[registrationCode]
		);

		if (usuario.length < 1) {
			const error = new Error(
				'No hay usuario pendientes de validar con este código'
			);
			error.httpStatus = 404;
			throw error;
		}

		await connection.query(
			`UPDATE usuarios SET activo = true, codigoRegistro = NULL WHERE codigoRegistro = ?;`,
			[registrationCode]
		);

		res.send({
			status: 'ok',
			message: 'Usuario verificado, bienvenido!',
		});
	} catch (error) {
		next(error);
	} finally {
		if (connection) connection.release();
	}
};

module.exports = validateUsuario;
