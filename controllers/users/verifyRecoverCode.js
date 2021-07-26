const getDB = require('../../ddbb/db');

const verifyRecoverCode = async (req, res, next) => {
	let connection;

	try {
		connection = await getDB();

		const { recoverCode } = req.params;

		const [usuario] = await connection.query(
			`SELECT id FROM usuarios WHERE codigoRecuperacion = ?;`,
			[recoverCode]
		);

		if (usuario.length < 1) {
			const error = new Error(
				'el codigo de recuperacion no coincide con el criterio de busqueda'
			);
			error.httpStatus = 404;
			throw error;
		}

		res.send({
			status: 'ok',
			message: 'Codigo de recuperacion verificado, redirigiendo...',
		});
	} catch (error) {
		next(error);
	} finally {
		if (connection) connection.release();
	}
};

module.exports = verifyRecoverCode;
